import React, {useCallback, useMemo} from 'react'
import {Alert, View} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import Share from 'react-native-share'
import {useDispatch, useSelector} from 'react-redux'
import {CommonActions, useNavigation, useRoute} from '@react-navigation/native'
import styled from 'styled-components/native'

import {CreateAnAccountText, GettingText} from '../../../CommonStyle/AuthContainer'
import AppContainer from '../../../Components/AppContainer'
import AppHeader from '../../../Components/AppHeader'
import AppProfileIcon from '../../../Components/AppProfileIcon'
import TouchText from '../../../Components/TouchText'
import {logOut} from '../../../Redux/Reducers/UserSlice'
import English from '../../../Resources/Locales/English'
import {Images, Screens} from '../../../Theme'
import {CommonStyles} from '../../../Theme/CommonStyles'
import {scale, verticalScale} from '../../../Theme/Responsive'
import Utility from '../../../Theme/Utility'
import SettingButton from './Components/SettingButton'

const SettingScreen = () => {
  const navigation: any = useNavigation()
  const route: any = useRoute().params
  const isDrawer = route?.isDrawer
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state?.user?.userData)

  const onPressLogOut = useCallback(() => {
    Utility.destroyVoice()
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {
            name: Screens.AuthKey,
            params: {
              isLogOut: true
            }
          }
        ]
      })
    )
    dispatch(logOut())
  }, [dispatch, navigation])

  const onPressShare = () => {
    const options = {
      message: "Let's install this App REEVA"
    }
    Share.open(options)
  }

  const onPressButton = useCallback(
    (id: number) => {
      switch (id) {
        case 1:
          navigation.navigate(Screens.PremiumPlanScreen)
          break
        case 2:
          Utility.showAlert('Coming Soon')
          break
        case 3:
          onPressShare()
          break
        case 4:
          navigation.navigate(Screens.FeedbackScreen)
          break
        case 5:
          Utility.showAlert('Coming Soon')
          break

        case 6:
          Alert.alert(
            'Reeva',
            'Are you sure you want to log out ?',
            [
              {
                text: 'Cancel',
                style: 'cancel'
              },
              {text: 'OK', onPress: () => onPressLogOut()}
            ],
            {userInterfaceStyle: 'light'}
          )

          break
        default:
          navigation.navigate(Screens.UserProfileScreen)
          break
      }
    },
    [navigation, onPressLogOut]
  )

  const renderProfileView = useMemo(() => {
    return (
      <ProfileContainer onPress={onPressButton}>
        <AppProfileIcon borderWidth={0} url={user?.profile_image} />
        <NameContainer>
          {
            <GettingText marginBottom={1}>
              {user?.first_name || user?.last_name ? user?.first_name + ' ' + user?.last_name : '-'}
            </GettingText>
          }
          <CreateAnAccountText marginBottom={1}>{user?.email}</CreateAnAccountText>
        </NameContainer>
        <ImageContainer source={Images.right_arrow} />
      </ProfileContainer>
    )
  }, [onPressButton, user?.email, user?.first_name, user?.last_name, user?.profile_image])

  return (
    <AppContainer>
      <AppHeader isMenu={isDrawer} isBack={!isDrawer} title={English.R123} />
      {renderProfileView}
      <View style={CommonStyles.flex}>
        <SettingButton
          onPress={() => onPressButton(1)}
          isArrow
          image={Images.plan}
          title={English.R124}
        />
        <SettingButton onPress={() => onPressButton(2)} image={Images.start} title={English.R125} />
        <SettingButton onPress={() => onPressButton(3)} image={Images.share} title={English.R126} />
        <SettingButton
          onPress={() => onPressButton(4)}
          isArrow
          image={Images.about}
          title={English.R127}
        />
        <SettingButton
          onPress={() => onPressButton(5)}
          image={Images.brokerage}
          title={English.R128}
        />
      </View>
      <SettingButton
        onPress={() => onPressButton(6)}
        image={Images.log_out2}
        title={English.R129}
      />
      <TouchText
        marginTop={verticalScale(30)}
        marginBottom={verticalScale(30)}
        textAlign={'center'}
        text={English.R130 + DeviceInfo.getVersion()}
      />
    </AppContainer>
  )
}

export default SettingScreen

const ProfileContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: ${verticalScale(30)}px;
  margin-bottom: ${verticalScale(30)}px;
  margin-left: ${scale(20)}px;
  margin-right: ${scale(20)}px;
`
const NameContainer = styled.View`
  margin-left: ${scale(10)}px;
  flex: 1;
  justify-content: center;
`

export const ImageContainer = styled.Image`
  /* margin-left: ${scale(10)}px;
  width: ${verticalScale(20)}px;
  height: ${verticalScale(20)}px;
  tint-color: ${(props: any) => props?.color || ''}; */
`