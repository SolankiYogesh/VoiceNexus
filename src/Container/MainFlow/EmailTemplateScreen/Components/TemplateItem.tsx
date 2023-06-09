import React, {useCallback} from 'react'
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {useNavigation} from '@react-navigation/native'

import {Colors, Images, Screens} from '../../../../Theme'
import {Fonts} from '../../../../Theme/Fonts'
import {moderateScale, scale, verticalScale} from '../../../../Theme/Responsive'

const TemplateItem = ({item, contactItem}: any) => {
  const navigation: any = useNavigation()

  const onPressTemplate = useCallback(() => {
    if (contactItem) {
      navigation.push(Screens.OfferDetailsScreen, {
        item,
        contactItem
      })
    } else {
      navigation.push(Screens.ContactListScreen, {
        item,
        isFromTemplate: true
      })
    }
  }, [contactItem, item, navigation])
  return (
    <TouchableOpacity onPress={onPressTemplate} style={styles.templateContainer}>
      <Text style={styles.titleText}>{item?.email_type}</Text>
      <Image source={Images.send} resizeMode={'contain'} style={styles.sendImage} />
    </TouchableOpacity>
  )
}

export default TemplateItem
const styles = StyleSheet.create({
  templateContainer: {
    backgroundColor: Colors.white,
    shadowColor: Colors.greyShade9C9D,
    shadowOffset: {
      width: 0,
      height: 16
    },
    shadowOpacity: 0.05,
    shadowRadius: 42,
    elevation: 3,
    padding: scale(15),
    marginHorizontal: scale(20),
    marginVertical: verticalScale(10),
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText: {
    fontSize: moderateScale(15),
    fontFamily: Fonts.ThemeSemiBold,
    color: Colors.purpleShadB0,
    flex: 1
  },
  sendImage: {
    tintColor: Colors.ThemeColor
  }
})
