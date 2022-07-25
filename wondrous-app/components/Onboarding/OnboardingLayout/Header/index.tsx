import React from 'react';
import Link from 'next/link';

import { Header, LogoText, Wonder } from './styles';
import WonderLogo from '../../../../public/images/onboarding/wonder-logo.svg';
import { Button } from 'components/Button';

type Props = {
  children?: any;
  login?: boolean;
  secondVersionLogo?: boolean;
  withLoginButton?: boolean;
  withSignupButton?: boolean;
};

const styleSecondVersionLogoWrapper = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const styleSecondVersionLogo = {
  margin: '8px 0 0',
};

const styleSecondVersionHeader = {
  display: 'inline-block',
};

const OnboardingHeader = ({
  children,
  withLoginButton = false,
  withSignupButton = false,
  secondVersionLogo,
}: Props) => (
  <Header style={secondVersionLogo ? styleSecondVersionHeader : null}>
    <Wonder style={secondVersionLogo ? styleSecondVersionLogoWrapper : null}>
      <WonderLogo />
      <LogoText style={secondVersionLogo ? styleSecondVersionLogo : null}>wonder</LogoText>
    </Wonder>
    {withLoginButton || withSignupButton ? (
      <Link href={withSignupButton ? '/signup' : `/login`} passHref>
        <div>
          <Button>{withSignupButton ? 'Sign up' : 'Login'}</Button>
        </div>
      </Link>
    ) : (
      children
    )}
  </Header>
);

export default OnboardingHeader;
