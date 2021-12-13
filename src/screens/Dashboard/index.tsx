import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import  AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { useTheme } from 'styled-components'
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
  LogoutButton,
  LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: number;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataListProps[]>([])
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);
  const theme = useTheme();

  function getLastTransactionData(transactions: DataListProps[], type: 'positive' | 'negative') {
    const lastTransaction = Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(
      new Date(Math.max.apply(Math, transactions
        .filter((item: DataListProps) => item.type === type)
        .map((item: DataListProps) => new Date(item.date).getTime())
      ))
    );
    return lastTransaction
  }
  
  async function loadTransaction() {
    setIsLoading(true)
    const dataKey = '@gofinances:transaction';
    const response = await AsyncStorage.getItem(dataKey);

    let entriesSum = 0;
    let expensive = 0;

    const transactions = response ? JSON.parse(response) : [];
    
    const transactionFormatted: DataListProps[] = transactions
      .map((item: DataListProps) => {

        if(item.type === 'positive') entriesSum += Number(item.amount)
        if(item.type === 'negative') expensive += Number(item.amount)

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

      const lastEntries = getLastTransactionData(transactions, 'positive')
      const lastExpensive = getLastTransactionData(transactions, 'negative')
        
      setHighlightData({
        entries: { amount: entriesSum.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}), lastTransaction: lastEntries },
        expensives: { amount: expensive.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}), lastTransaction: lastExpensive },
        total: { amount: (entriesSum - expensive).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}), lastTransaction: '' }
      })
      setData(transactionFormatted)
      setIsLoading(false)
  }

  useEffect(() => {
    loadTransaction()
  }, [])

  useFocusEffect(useCallback(() => {
    loadTransaction()
  }, []));


  return (
    <Container>
      { isLoading ? (
        <LoadContainer>
          <ActivityIndicator
            color={theme.colors.primary}
            size="large"  
          />
        </LoadContainer>
      ) : (
        <>
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
              amount={highlightData.entries.amount}
              lastTransaction={`Última entrada: ${highlightData.entries.lastTransaction}`}
              type="up"
            />
            <HighlightCard
              title="Saídas"
              amount={highlightData.expensives.amount}
              lastTransaction={`Última saída: ${highlightData.expensives.lastTransaction}`}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={`01 a ${highlightData.expensives.lastTransaction}`}
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
        </>
      )}
    </Container>
  );
}
