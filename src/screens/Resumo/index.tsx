import React, { useEffect, useState } from 'react';
import { VictoryPie } from 'victory-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistoryCar from '../../components/HistoryCar';
import { TransactionCardProps } from '../../components/TransactionCard';
import { categories } from '../../utils/categories';
import { Container, Header, Title, Content, ChartContainer } from './styles';
import { useTheme } from 'styled-components';
import { RFValue } from 'react-native-responsive-fontsize';

interface CategoryData {
  name: string;
  total: number;
  totalFormatted: string;
  color: string
  percent: string;
}

function Resumo() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
  const theme =  useTheme();
  async function loadData() {
    const dataKey = '@gofinances:transaction';
    const data = await AsyncStorage.getItem(dataKey);
    const dataFormatted = data ? JSON.parse(data) : [];

    const expensives = dataFormatted
      .filter((expensive: TransactionCardProps) => expensive.type === 'negative')

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

  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content>
        
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

    </Container>
  );
};

export default Resumo;
