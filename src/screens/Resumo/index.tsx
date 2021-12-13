import React, { useCallback, useEffect, useState } from 'react';
import { VictoryPie } from 'victory-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistoryCar from '../../components/HistoryCar';
import { TransactionCardProps } from '../../components/TransactionCard';
import { categories } from '../../utils/categories';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Container,
  Header,
  Title, 
  Content, 
  ChartContainer, 
  MonthSelect,
  MonthSelectButton,
  SelectIcon,
  Month,
  LoadContainer
} from './styles';
import { useTheme } from 'styled-components';
import { RFValue } from 'react-native-responsive-fontsize';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface CategoryData {
  name: string;
  total: number;
  totalFormatted: string;
  color: string
  percent: string;
}

function Resumo() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
  const theme =  useTheme();

  function handleDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      const newDate = addMonths(selectedDate, 1)
      setSelectedDate(newDate);
    } else {
      const newDate = subMonths(selectedDate, 1)
      setSelectedDate(newDate);
    }
  }

  async function loadData() {
    setIsLoading(true)
    const dataKey = '@gofinances:transaction';
    const data = await AsyncStorage.getItem(dataKey);
    const dataFormatted = data ? JSON.parse(data) : [];

    const expensives = dataFormatted
      .filter((expensive: TransactionCardProps) => 
        expensive.type === 'negative' &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()

      
      )

    const expensiveTotal = expensives.reduce((acc: number, cur: TransactionCardProps) => {
      return acc + Number(cur.amount);
    }, 0);

    let totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionCardProps) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount)
        }
      });
      
      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})

        const percent = `${(categorySum / expensiveTotal * 100).toFixed(0)}%`

        totalByCategory.push({
          name: category.name,
          totalFormatted,
          color: category.color,
          total: categorySum,
          percent
        });
      }
    });

    setTotalByCategories(totalByCategory)
    setIsLoading(false)
  }

  useFocusEffect(useCallback(() => {
    loadData()
  }, [selectedDate]))
 

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator
            color={theme.colors.primary}
            size="large"  
          />
        </LoadContainer> ) : (
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight(),
            }}
          >
            <MonthSelect>
              <MonthSelectButton onPress={() => handleDateChange('prev')}>
                <SelectIcon name="chevron-left" />
              </MonthSelectButton> 

              <Month>{ format(selectedDate, 'MMMM, yyyy', { locale: ptBR }) }</Month>

              <MonthSelectButton onPress={() => handleDateChange('next')}>
                <SelectIcon name="chevron-right" />
              </MonthSelectButton>
            </MonthSelect>

            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                colorScale={totalByCategories.map(item => item.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape
                  }
                }}
                labelRadius={50}
                x="percent"
                y="total"
                height={300}
              />
            </ChartContainer>

            {totalByCategories.map(item => (
              <HistoryCar
                key={item.name}
                title={item.name}
                amount={item.totalFormatted}
                color={item.color}
              />
            ))}
          </Content>  
      )}
    </Container>
  );
};

export default Resumo;
