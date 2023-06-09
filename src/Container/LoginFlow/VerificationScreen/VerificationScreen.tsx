import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {useDispatch} from 'react-redux'
import {CommonActions, useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import styled from 'styled-components/native'

import APICall from '../../../APIRequest/APICall'
import EndPoints from '../../../APIRequest/EndPoints'
import AppButton from '../../../Components/AppButton'
import AppContainer from '../../../Components/AppContainer'
import AppScrollView from '../../../Components/AppScrollView'
import BackButton from '../../../Components/BackButton'
import Loader from '../../../Components/Loader'
import Timer, {ICountdownRef} from '../../../Components/Timer'
import TouchText from '../../../Components/TouchText'
import {setUserData} from '../../../Redux/Reducers/UserSlice'
import English from '../../../Resources/Locales/English'
import {Colors, Constant, Screens} from '../../../Theme'
import {
  CommonStyles,
  CreateAnAccountText,
  GettingText,
  ScrollContainer
} from '../../../Theme/CommonStyles'
import {verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import OTPInput from './Components/OTPInput'

const VerificationScreen = () => {
  const [otpCode, setOTPCode] = useState('')
  const [isPinReady, setIsPinReady] = useState(false)
  const [isTimer, setIsTimer] = useState(true)
  const params: any = useRoute()?.params
  const email: string = params?.email
  const navigation: any = useNavigation()
  const timerRef = useRef<ICountdownRef>(null)
  const isFocus = useIsFocused()
  const [isEnabled, setISEnabled] = useState(false)
  const route: any = useRoute()
  const isRegister = route?.params?.isRegister
  const isSocialLogin = route?.params?.isSocialLogin
  const dispatch = useDispatch()

  const onLoginSetup = useCallback(
    (resp: any) => {
      Constant.token = resp?.data?.token
      Constant.refresh = resp?.data?.refresh_token
      const cloneData = Utility.deepClone(resp?.data?.data)
      cloneData.token = resp?.data?.token
      cloneData.refresh_token = resp?.data?.refresh_token

      dispatch(setUserData(cloneData))

      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: Screens.Drawer,
              params: {
                isLogOut: true
              }
            }
          ]
        })
      )
    },
    [dispatch, navigation]
  )

  useEffect(() => {
    if (isFocus) {
      setOTPCode('')
    }
  }, [isFocus])

  useEffect(() => {
    setISEnabled(isPinReady)
  }, [isPinReady])

  const onPressChangeEmail = useCallback(() => {
    if (isRegister) {
      navigation.goBack()
      navigation.goBack()
    } else {
      navigation.goBack()
    }
  }, [navigation, isRegister])

  const onPressConfirm = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    if (otpCode.length < 4) {
      Utility.showAlert(English.R54)
      return
    }

    const payload = {
      email,
      otp: otpCode
    }
    Loader.isLoading(true)
    APICall('post', payload, EndPoints.verifyOTP)
      .then((resp: any) => {
        Loader.isLoading(false)

        if (resp?.status === 200) {
          if (isRegister && !isSocialLogin) {
            navigation.replace(Screens.LoginScreen)
          } else if (isSocialLogin) {
            if (isSocialLogin?.isApple) {
              Utility.appleAPILogin(isSocialLogin)
                .then((resp) => {
                  if (resp?.status === 200 && resp?.data?.data && !resp?.data?.is_new_user) {
                    onLoginSetup(resp)
                  }
                })
                .catch(() => {
                  navigation.replace(Screens.LoginScreen)
                })
            } else if (isSocialLogin?.isGoogle) {
              Utility.googleAPILogin(isSocialLogin)
                .then((resp) => {
                  if (resp?.status === 200 && resp?.data?.data && !resp?.data?.is_new_user) {
                    onLoginSetup(resp)
                  }
                })
                .catch(() => {
                  navigation.replace(Screens.LoginScreen)
                })
            } else {
              navigation.replace(Screens.LoginScreen)
            }
          } else {
            Constant.token = resp?.data?.data?.token
            navigation.navigate(Screens.NewPasswordScreen, {
              email,
              data: resp?.data?.data
            })
          }
        } else {
          setOTPCode('')
          Utility.showAlert(resp?.data?.message)
        }
      })
      .catch((e) => {
        Utility.showAlert(String(e?.data?.message))
        Loader.isLoading(false)
      })
  }, [otpCode, email, isRegister, isSocialLogin, navigation, onLoginSetup])

  const onPressResend = useCallback(async () => {
    const isInternet = await Utility.isInternet()
    if (!isInternet) {
      return
    }
    const payload = {
      email
    }
    Loader.isLoading(true)
    APICall('post', payload, EndPoints.resendOTP)
      .then((resp: any) => {
        Constant.BROKERDATA = null
        Loader.isLoading(false)
        Utility.showAlert(resp?.data?.message)
        setOTPCode('')
        if (timerRef?.current) {
          timerRef?.current?.start()
        }
        setIsTimer(true)
      })
      .catch((e) => {
        Utility.showAlert(String(e?.data?.message))
        Loader.isLoading(false)
      })
  }, [timerRef, setIsTimer, email])

  const renderTimer = useMemo(() => {
    return <Timer ref={timerRef} onEnd={() => setIsTimer(false)} autoStart initialSeconds={60} />
  }, [setIsTimer, timerRef])

  return (
    <AppContainer>
      <ScrollContainer>
        <AppScrollView>
          <BackButton onPress={onPressChangeEmail} />
          <GettingText>{English.R36}</GettingText>
          <CreateAnAccountText>{English.R37}</CreateAnAccountText>

          <View style={[CommonStyles.rowView, styles.emailContainer]}>
            <TouchText
              marginTop={0}
              color={Colors.blackShade2A30}
              marginBottom={0}
              textAlign={'left'}
              text={Utility.hideEmail(email)}
            />

            <TouchText
              marginTop={0}
              marginBottom={0}
              textAlign={'left'}
              text={English.R41}
              onPress={onPressChangeEmail}
            />
          </View>

          <OTPInput
            setIsPinReady={setIsPinReady}
            maximumLength={4}
            code={otpCode}
            setCode={setOTPCode}
          />

          <View style={CommonStyles.onlyRow}>
            <TouchText
              marginTop={verticalScale(30)}
              marginBottom={verticalScale(30)}
              textAlign={'left'}
              text={English.R38}
              color={Colors.blackShade2A30}
            />
            {renderTimer}
          </View>

          <RowView>
            <AppButton
              style={styles.resendButton}
              title={English.R39}
              onPress={onPressResend}
              disabled={isTimer}
            />
            <AppButton
              disabled={!isEnabled}
              style={styles.confirmButton}
              onPress={onPressConfirm}
              title={English.R40}
            />
          </RowView>
        </AppScrollView>
      </ScrollContainer>
    </AppContainer>
  )
}

export default VerificationScreen
const RowView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const styles = StyleSheet.create({
  resendButton: {
    width: '45%'
  },
  confirmButton: {
    width: '45%'
  },
  emailContainer: {
    flex: 1,
    flexWrap: 'wrap'
  }
})
