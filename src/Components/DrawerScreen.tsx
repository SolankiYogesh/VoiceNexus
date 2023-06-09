import React, {useCallback, useEffect} from 'react'
import {Image, ScrollView, TouchableOpacity} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {DrawerContentComponentProps, DrawerItem, useDrawerStatus} from '@react-navigation/drawer'
import {CommonActions} from '@react-navigation/native'
import styled from 'styled-components/native'

import {logOut} from '../Redux/Reducers/UserSlice'
import English from '../Resources/Locales/English'
import {Colors, Images, Screens} from '../Theme'
import {Fonts} from '../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../Theme/Responsive'
import Utility from '../Theme/Utility'
import AlertLoader from './AlertLoader'
import AppProfileIcon from './AppProfileIcon'

interface DrawerScreenProps extends DrawerContentComponentProps {
  onToggle: (status: boolean) => void
}

const DrawerScreen = (props: DrawerScreenProps) => {
  const {navigation, state, onToggle} = props
  const status = useDrawerStatus()
  const dispatch = useDispatch()
  const onPressClose = useCallback(() => {
    navigation.closeDrawer()
  }, [navigation])
  const user = useSelector((state: any) => state?.user?.userData)

  useEffect(() => {
    onToggle(status === 'open')
  }, [onToggle, status])

  const onPressScreen = useCallback(
    (screen: string) => {
      navigation.navigate(screen, {
        isDrawer: true
      })
    },
    [navigation]
  )

  const onPressLogOut = useCallback(() => {
    AlertLoader.show(English.R204, [
      {
        title: 'Cancel',
        style: 'cancel'
      },
      {
        title: 'OK',
        style: 'default',
        onPress: () => {
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
        }
      }
    ])
  }, [dispatch, navigation])

  const onPressProfile = useCallback(() => {
    navigation.navigate(Screens.UserProfileScreen)
  }, [navigation])

  return (
    <>
      <Container>
        <TouchableOpacity activeOpacity={1} onPress={onPressProfile}>
          <ImageBackContainer source={Images.draw_back}>
            <IMGContainer>
              <AppProfileIcon
                size={85}
                style={{marginHorizontal: scale(10)}}
                borderRadius={300}
                borderWidth={4}
                borderColor={Colors.white}
                url={user?.profile_image}
              />
              <TextView>
                <TextUsername adjustsFontSizeToFit numberOfLines={1}>
                  {user?.first_name + ' ' + user?.last_name}
                </TextUsername>
                <TextEmail adjustsFontSizeToFit numberOfLines={1}>
                  {user?.email}
                </TextEmail>
              </TextView>
            </IMGContainer>
            {!!user?.total_counters?.total_contracts &&
              !!user?.total_counters?.total_contract_time && (
                <CountText>
                  {English.R199}
                  <CountText isBold>{user?.total_counters?.total_contract_time}</CountText>
                  <CountText>{English.R200}</CountText>
                  <CountText isBold>{user?.total_counters?.total_contracts}</CountText>

                  <CountText>{English.R201}</CountText>
                </CountText>
              )}
          </ImageBackContainer>
        </TouchableOpacity>
        <ScrollView scrollEnabled={false} showsVerticalScrollIndicator={false}>
          <DrawerItem
            {...props}
            activeBackgroundColor={Colors.transparent}
            pressColor={Colors.transparent}
            onPress={() => onPressScreen(Screens.VoiceChatScreen)}
            focused={state.routeNames[state.index] === Screens.VoiceChatScreen}
            icon={({focused}) => (
              <Image
                source={Images.Home}
                style={{
                  tintColor: focused ? Colors.ThemeColor : Colors.greyShadeBBB
                }}
              />
            )}
            label={({focused}) => <TextContainer focus={focused}>{English.R184}</TextContainer>}
          />
          <DrawerItem
            {...props}
            activeBackgroundColor={Colors.transparent}
            pressColor={Colors.transparent}
            onPress={() => onPressScreen(Screens.OffersScreen)}
            focused={state.routeNames[state.index] === Screens.OffersScreen}
            icon={({focused}) => (
              <Image
                source={Images.offers}
                style={{
                  tintColor: focused ? Colors.ThemeColor : Colors.greyShadeBBB,
                  width: scale(18)
                }}
              />
            )}
            label={({focused}) => <TextContainer focus={focused}>{English.R103}</TextContainer>}
          />
          <DrawerItem
            {...props}
            activeBackgroundColor={Colors.transparent}
            pressColor={Colors.transparent}
            onPress={() => onPressScreen(Screens.ContactListScreen)}
            focused={state.routeNames[state.index] === Screens.ContactListScreen}
            icon={({focused}) => (
              <Image
                source={Images.myContacts}
                style={{
                  tintColor: focused ? Colors.ThemeColor : Colors.greyShadeBBB
                }}
              />
            )}
            label={({focused}) => <TextContainer focus={focused}>{English.R102}</TextContainer>}
          />
          <DrawerItem
            {...props}
            activeBackgroundColor={Colors.transparent}
            pressColor={Colors.transparent}
            focused={state.routeNames[state.index] === Screens.EmailTemplateScreen}
            onPress={() => onPressScreen(Screens.EmailTemplateScreen)}
            icon={({focused}) => (
              <Image
                source={Images.email_templates}
                style={{
                  tintColor: focused ? Colors.ThemeColor : Colors.greyShadeBBB
                }}
              />
            )}
            label={({focused}) => <TextContainer focus={focused}>{English.R101}</TextContainer>}
          />
          <DrawerItem
            {...props}
            activeBackgroundColor={Colors.transparent}
            pressColor={Colors.transparent}
            focused={state.routeNames[state.index] === Screens.PremiumPlanScreen}
            onPress={() => onPressScreen(Screens.PremiumPlanScreen)}
            icon={({focused}) => (
              <Image
                source={Images.plan}
                style={{
                  tintColor: focused ? Colors.ThemeColor : Colors.greyShadeBBB
                }}
              />
            )}
            label={({focused}) => <TextContainer focus={focused}>{English.R124}</TextContainer>}
          />
        </ScrollView>

        <DrawerItem
          {...props}
          activeBackgroundColor={Colors.transparent}
          pressColor={Colors.transparent}
          focused={state.routeNames[state.index] === Screens.SettingScreen}
          onPress={() => onPressScreen(Screens.SettingScreen)}
          icon={({focused}) => (
            <Image
              source={Images.setting}
              style={{
                tintColor: focused ? Colors.ThemeColor : Colors.greyShadeBBB
              }}
            />
          )}
          label={({focused}) => <TextContainer focus={focused}>{English.R104}</TextContainer>}
        />
        <DrawerItem
          {...props}
          activeBackgroundColor={Colors.transparent}
          pressColor={Colors.transparent}
          onPress={onPressLogOut}
          icon={({focused}) => (
            <Image
              source={Images.logout}
              style={{
                tintColor: focused ? Colors.ThemeColor : Colors.greyShadeBBB
              }}
            />
          )}
          label={({focused}) => <TextContainer focus={focused}>{English.R105}</TextContainer>}
        />
      </Container>
      <CloseImageContainer onPress={onPressClose}>
        <CloseImage source={Images.close} />
      </CloseImageContainer>
    </>
  )
}

export default DrawerScreen

const ImageBackContainer = styled.ImageBackground`
  width: 100%;
  height: ${verticalScale(150)}px;
`

const IMGContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  margin-bottom: auto;
`

const TextContainer = styled.Text`
  font-family: ${(props: any) => (props?.focus ? Fonts.ThemeBold : Fonts.ThemeMedium)};
  font-size: ${moderateScale(15)}px;
  color: ${(props: any) => (props?.focus ? Colors.ThemeColor : Colors.greyShadeBBB)};
`
const TextView = styled.View`
  margin-left: ${scale(10)}px;
  flex: 1;
  margin-right: ${scale(10)}px;
`
const TextUsername = styled.Text`
  font-family: ${Fonts.ThemeBold};
  font-size: ${moderateScale(17)}px;
  color: ${Colors.white};
  margin-bottom: 5px;
`
const TextEmail = styled.Text`
  font-family: ${Fonts.ThemeMedium};
  font-size: ${moderateScale(14)}px;
  color: ${Colors.white};
  margin-top: 5px;
`
export const Container = styled.View`
  flex: 1;
  width: 85%;
  background-color: ${Colors.white};
  border-radius: ${moderateScale(10)}px;
  overflow: hidden;
  margin-top: ${verticalScale(10)}px;
  margin-bottom: ${verticalScale(10)}px;
`
export const CloseImageContainer = styled.TouchableOpacity`
  width: ${verticalScale(40)}px;
  height: ${verticalScale(40)}px;
  position: absolute;
  background-color: ${Colors.ThemeColor};
  border-radius: ${moderateScale(300)}px;
  align-items: center;
  justify-content: center;
  right: 2px;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
  margin-top: ${verticalScale(10)}px;
`

export const CloseImage = styled.Image`
  width: 40%;
  height: 40%;
  tint-color: white;
`
export const CountText = styled.Text`
  font-size: ${moderateScale(13)}px;
  color: ${(props: any) => props?.color || Colors.white};
  margin-bottom: ${(props: any) => props?.marginBottom || 'auto'};
  margin-top: ${(props: any) => props?.marginTop || 0}px;
  align-self: center;
  width: 90%;
  line-height: 18px;
  text-align: ${(props: any) => props?.textAlign || 'left'};
  font-family: ${(props: any) => (props?.isBold ? Fonts.ThemeBold : Fonts.ThemeMedium)};
`
