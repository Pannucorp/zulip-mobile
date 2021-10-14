/* @flow strict-local */

import React, { useContext, useEffect } from 'react';
import type { Node } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import WebView from 'react-native-webview';
import tw from 'tailwind-react-native-classnames';
import type { RouteProp } from '../react-navigation';
import type { AppNavigationProp } from '../nav/AppNavigator';
import { Screen } from '../common';
import { TranslationContext } from '../boot/TranslationProvider';
import { LOGIN_MUTATION } from '../api/graphql/auth';
import { ARTICLES_QUERY } from '../api/graphql/article';

type Props = $ReadOnly<{|
  navigation: AppNavigationProp<'welcome'>,
  route: RouteProp<'welcome', void>,
|}>;

export default function WelcomeScreen(props: Props): Node {
  const { navigation } = props;
  const _ = useContext(TranslationContext);

  const [getJWT, { loading: jwtLoading }] = useMutation(
    LOGIN_MUTATION
  );

  const [loadData, { loading, error, data }] = useLazyQuery(
    ARTICLES_QUERY,
    {
      variables: {},
      fetchPolicy: 'no-cache',
    }
  );

  useEffect(() => {
    // if (data) {
    //   console.log('data:::::::::::::::::', data);
    // }
    // if (loading) {
    //   console.log('data:::::::::::::::::', loading);
    // }
    // if (error) {
    //   console.log('data:::::::::::::::::', JSON.stringify(error));
    // }
  }, [data, loading, error]);

  const onJWT = async () => {
    const {data} = await getJWT({
      variables: {
        identifier: '',
        password: ''
      },
    });
    if (data&&data.login&&data.login.jwt) {
      console.log('************', data.login.jwt);
    }
  };

  useEffect(() => {
    onJWT();
  }, []);

  const handleWebViewNavigationStateChange = (newNavState) => {
    const { url } = newNavState;
    console.log(url);
  };

  return (
    <Screen
      title="Welcome"
      centerContent
      padding
      canGoBack={navigation.canGoBack()}
      shouldShowLoadingBanner={false}
    >
      <WebView
        style={tw`my-4`}
        source={{ uri: 'https://pannucorp.vercel.app' }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
    </Screen>
  );
}
