import React, { useEffect, useState } from 'react';
import  AsyncStorage from '@react-native-async-storage/async-storage';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: number;
}

export function Dashboard() {
  const [data, setData] = useState<DataListProps[]>([])
  
  async function loadTransaction() {
    const dataKey = '@gofinances:transaction';
    const response = await AsyncStorage.getItem(dataKey);
    console.log(response)
    const transactions = response ? JSON.parse(response) : [];
    
    const transactionFormatted: DataListProps[] = transactions
      .map((item: DataListProps) => {
        const amount = Number(item.amount)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          });
      
        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date));

        return {
          ...item,
          amount,
          date,
        }
      })
      setData(transactionFormatted)
  }
  useEffect(() => {
    loadTransaction()

  }, [])
  console.log(data)

  return (
    <Container>
      <Header>
        <UserWrapper>        
          <UserInfo>
            <Photo
              source={{ uri: 'https://avatars.githubusercontent.com/u/78037936?v=4' }}
            />
            <User>
              <UserGreeting>Olá </UserGreeting>
              <UserName>Paulo</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          title="Entradas"
          amount="R$ 12.000,00"
          lastTransaction="Última transação dia 12 de agosto"
          type="up"
        />
        <HighlightCard
          title="Saídas"
          amount="R$ 1.000,00"
          lastTransaction="Última transação dia 10 de agosto"
          type="down"
        />
        <HighlightCard
          title="Total"
          amount="R$ 11.000,00"
          lastTransaction="01 a 15 de agosto"
          type="total"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionList<any>
          data={data}
          keyExtractor={(item: DataListProps) => item.id}
          renderItem={({ item }: { item: TransactionCardProps }) =>  <TransactionCard data={item}/>}
        />
      </Transactions>
    </Container>
  );
}
