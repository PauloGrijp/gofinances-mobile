import React from 'react';
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
  TransactionList
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: number;
}

export function Dashboard() {
  const data: DataListProps[] = [
    {
      id: 1,
      type: 'positive',
      title: 'Desenvolvimento de software',
      amount: 'R$ 6.000,00',
      category: {name: 'vendas', icon: 'dollar-sign'},
      date: '12/08/2021',
    },
    {
      id: 2,
      type: 'negative',
      title: 'Aluguel de apartamento',
      amount: 'R$ 1.000,00',
      category: {name: 'casa', icon: 'shopping-bag'},
      date: '12/08/2021',
    },
    {
      id: 3,
      type: 'negative', 
      title: 'Supermercado',
      amount: 'R$ 400,00',
      category: {name: 'comida', icon: 'coffee'},
      date: '11/08/2021',
    } 
  ]
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
          <Icon name="power" />
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
