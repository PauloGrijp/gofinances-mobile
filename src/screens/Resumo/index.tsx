import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistoryCar from '../../components/HistoryCar';
import { TransactionCardProps } from '../../components/TransactionCard';
import { categories } from '../../utils/categories';
import { Container, Header, Title, Content } from './styles';

interface CategoryData {
  name: string;
  total: string;
  color: string
}

function Resumo() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

  async function loadData() {
    const dataKey = '@gofinances:transaction';
    const data = await AsyncStorage.getItem(dataKey);
    const dataFormatted = data ? JSON.parse(data) : [];

    const expensives = dataFormatted
      .filter((expensive: TransactionCardProps) => expensive.type === 'negative')

    let totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionCardProps) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount)
        }
      });
      
      if (categorySum > 0) {
        const total = categorySum.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
        totalByCategory.push({name: category.name, total, color: category.color});
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
        {totalByCategories.map(item => (
          <HistoryCar
          key={item.name}
            title={item.name}
            amount={item.total}
            color={item.color}
          />
        ))}
      </Content>

    </Container>
  );
};

export default Resumo;
