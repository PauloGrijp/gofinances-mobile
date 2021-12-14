import React, { useState } from 'react';
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import  AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import InputForm from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelcted } from '../CategorySelcted';

import { Container, Header, Title, Form, Fields, TrasactionsTypes } from './styles';

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório')
})

export function Register() {
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  })
  const [transactionType, setTransactionType] = useState('');
  const [categoryModal, setCategoryModal] = useState(false);
  const dataKey = '@gofinances:transactions';

  const { navigate }: NavigationProp<ParamListBase> = useNavigation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  function handleTransactionTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  async function handleRegister(form: FormData) {
    if (!transactionType) return Alert.alert('Selecione o tipo de transação');
    if (category.key === 'category') return Alert.alert('Selecione o tipo de categoria');

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    }

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [
        ...currentData,
        newTransaction,
      ]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType('')
      setCategory({
        key: 'category',
        name: 'Categoria',
      });

      navigate('Listagem');

    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível salvar');
    }
  }

  function handleCloseSelectCategory() {
    setCategoryModal(false);
  }

  function handleOpenSelectCategory() {
    setCategoryModal(true);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        
        <Form>
          <Fields>
            <InputForm 
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm 
              name="amount"
              control={control}
              placeholder="Valor"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <TrasactionsTypes>
              <TransactionTypeButton
                type="up"
                title="Income"
                onPress={() => handleTransactionTypeSelect('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton
                type="down"
                title="Outcome"
                onPress={() => handleTransactionTypeSelect('negative')}
                isActive={transactionType === 'negative'}
              />
            </TrasactionsTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategory}
            />
          </Fields>
          <Button
            title="Salvar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal visible={categoryModal}>
          <CategorySelcted
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategory}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
};
