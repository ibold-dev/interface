import { StyleSheet } from 'react-native'
import Svg, { Defs, RadialGradient as RadialGradientSVG, Rect, Stop } from 'react-native-svg'
import { Flex, Icons, Unicon, useUniconColors } from 'ui/src'
import { spacing } from 'ui/src/theme'
import { RemoteImage } from 'wallet/src/features/images/RemoteImage'

// Determines view only icon size in relation to Account Icon size
const EYE_ICON_SCALING_FACTOR = 0.4

export interface AccountIconProps {
  size: number
  showViewOnlyBadge?: boolean
  address: string
  avatarUri?: string | null
  showBackground?: boolean // Display images with solid background.
  showBorder?: boolean // Display border stroke around image
  backgroundPadding?: number
}

export function AccountIcon({
  size,
  showViewOnlyBadge,
  address,
  avatarUri,
  showBackground,
  showBorder,
  backgroundPadding = spacing.spacing12,
}: AccountIconProps): JSX.Element {
  // add padding to unicon if background is displayed
  const uniconPadding = showBackground ? backgroundPadding : spacing.none

  // adjust unicon size to account for potential padding
  const uniconSize = size - uniconPadding * 2

  // scale eye icon to be a portion of container size
  const eyeIconSize = size * EYE_ICON_SCALING_FACTOR

  // Color for gradient background.
  const { gradientEnd: uniconColor } = useUniconColors(address)

  const uniconImage = (
    <Flex centered borderRadius="$roundedFull" height={size} padding={uniconPadding} width={size}>
      <Unicon address={address} size={uniconSize} />
      {showBackground ? <UniconGradient color={uniconColor} size={size} /> : null}
    </Flex>
  )

  return (
    <Flex
      backgroundColor={showBackground ? '$surface1' : '$transparent'}
      borderColor={showBorder ? '$surface1' : '$transparent'}
      borderRadius="$roundedFull"
      borderWidth={showBorder ? 2 : 0}
      position="relative">
      {avatarUri ? (
        <RemoteImage
          borderRadius={size}
          fallback={uniconImage}
          height={size}
          resizeMode="cover"
          uri={avatarUri}
          width={size}
        />
      ) : (
        uniconImage
      )}
      {showViewOnlyBadge && (
        <Flex
          alignItems="center"
          backgroundColor="$surface2"
          borderColor="$surface1"
          borderRadius="$roundedFull"
          borderWidth={2}
          bottom={-4}
          justifyContent="center"
          position="absolute"
          right={-4}>
          <Icons.Eye color="$neutral2" size={eyeIconSize} />
        </Flex>
      )}
    </Flex>
  )
}

// Circle shaped gradient that follows Unicon colors.
const UniconGradient = ({ color, size }: { color: string; size: number }): JSX.Element => {
  return (
    <Svg height={size} style={UniconGradientStyles.svg} width={size}>
      <Defs>
        <RadialGradientSVG cy="-0.1" id="background" rx="0.8" ry="1.1">
          <Stop offset="0" stopColor={color} stopOpacity="0.2" />
          <Stop offset="1" stopColor={color} stopOpacity="0.2" />
        </RadialGradientSVG>
      </Defs>
      <Rect
        fill="url(#background)"
        height="100%"
        opacity={0.6}
        rx={size}
        width="100%"
        x="0"
        y="0"
      />
    </Svg>
  )
}

const UniconGradientStyles = StyleSheet.create({
  svg: {
    position: 'absolute',
  },
})
