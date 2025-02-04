import { Typography, Button } from '@material-ui/core'
import Link from 'next/link'
import styled from 'styled-components'
import { Green200, White, Yellow400 } from '../../services/colors'
import { createSpacingUnit } from '../../utils'
import { device } from '../../utils/device'
import SmartLink from '../SmartLink'

export const NavContainer = styled.div`
	&& {
		position: absolute;
		top: ${createSpacingUnit(1)}px;
		padding-top: ${createSpacingUnit(2)}px;
		padding-left: ${createSpacingUnit(4)}px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		z-index: 1000;
	}
`
export const LinkContainer = styled.div`
	flex-direction: row;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;

	& > .logo,
	& > .logotype {
		height: 44px;
	}
`

export const WaitlistContainer = styled(LinkContainer)`
	margin-right: ${createSpacingUnit(4)}px;
`

export const LogoLink = styled(Link)`
	margin-left: ${createSpacingUnit(2)}px;
	cursor: pointer;
`

export const FlexDiv = styled.div`
	flex: 1;
`

export const HomeNavLink = styled.a`
	&& {
		color: ${White};
		text-decoration: none;
		font-family: Faktum Bold;
	}
`

export const HomeNavLinkTypography = styled(Typography)`
	&& {
		display: inline;
		font-weight: bolder;
		color: ${White};
		@media ${device.mobileL} {
			font-size: 14px;
			line-height: 22px;
		}
	}
`

export const LinkDiv = styled.div`
	&& {
		text-align: right;
		padding-right: ${createSpacingUnit(6)}px;
		@media ${device.mobileL} {
			padding-right: ${createSpacingUnit(2)}px;
		}
	}
`

export const ManifestoLink = styled(HomeNavLinkTypography)`
	&& {
		margin-right: ${createSpacingUnit(6)}px;
		@media ${device.tablet} {
			margin-right: ${createSpacingUnit(2)}px;
		}
		@media (max-width: 550px) {
			display: none;
		}
	}
`

export const JoinDiscordButton = styled(HomeNavLink)`
	&& {
		border: 2px solid ${Green200};
		border-radius: 9px;
		padding: ${createSpacingUnit(2)}px;
	}
`
