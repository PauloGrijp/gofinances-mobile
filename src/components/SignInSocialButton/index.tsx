import  React from 'react';

import { RectButtonProps } from 'react-native-gesture-handler'; 
import { SvgProps } from 'react-native-svg';

import { Button, ImagemContainer, Text } from './styles';

interface SignInSocialButtonProps extends RectButtonProps {
  title: string;
  svg: React.FC<SvgProps>
}

function SignInSocialButton({ title, svg: Svg, ...rest }: SignInSocialButtonProps) {
  return (
    <Button {...rest}>
      <ImagemContainer>
        <Svg />
      </ImagemContainer>

      <Text>{title}</Text>
    </Button>
  );
};

export default SignInSocialButton;
