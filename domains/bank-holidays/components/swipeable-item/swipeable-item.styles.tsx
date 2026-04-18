import { Animated } from "react-native";
import styled from "styled-components/native";

export interface StyledActionButtonProps {
  variant?: "accent" | "success" | "error";
}

export const StyledListItem = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.textSecondary}33;
`;

export const StyledListItemInner = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

export const StyledListItemContentPressable = styled.Pressable`
  flex: 1;
  min-height: 44px;
  justify-content: center;
`;

export const StyledListItemContent = styled.View`
  flex: 1;
`;

export const StyledListItemTrailingIcon = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const StyledListItemMenuButton = styled.Pressable`
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: ${({ theme }) => theme.spacing.xSmall}px;
`;

export const StyledActionButtons = styled.View`
  flex-direction: row;
`;

export const StyledActionButton = styled.Pressable<StyledActionButtonProps>`
  width: 88px;
  padding: ${({ theme }) => theme.spacing.xSmall}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, variant }) =>
    theme.colors[variant || "accent"]};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.surface};
`;

export const StyledActionContent = styled.View`
  gap: ${({ theme }) => theme.spacing.xSmall}px;
  align-items: center;
  justify-content: center;
`;

export const StyledActionButtonLabel = styled.Text`
  color: ${({ theme }) => theme.colors.surface};
  font-size: 12px;
  font-weight: 700;
  text-align: center;
`;

export const StyledListItemTitle = styled.Text`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
`;

export const StyledListItemDate = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  line-height: 20px;
`;
