import React from 'react';

import { Container, Title, Amount } from './styles';

interface HistoryCarProps {
  color: string;
  title: string;
  amount: string;
}

function HistoryCard({ color, title, amount}: HistoryCarProps) {
  return (
    <Container color={color}>
     <Title>{title}</Title>
     <Amount>{amount}</Amount>
    </Container>
  );
};

export default HistoryCard;
