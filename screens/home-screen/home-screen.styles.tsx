import styled from "styled-components/native";

export const StyledContainer = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const StyledCard = styled.View`
  width: 100%;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.small}px;
  padding: ${({ theme }) => theme.spacing.xLarge}px;
  border-radius: ${({ theme }) => theme.radius.medium}px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const StyledTitle = styled.Text`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 28px;
  font-weight: 700;
  text-align: center;
`;

export const StyledBody = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 16px;
  line-height: 24px;
  text-align: center;
`;

export const StyledListContent = {
  paddingTop: 24,
};

export const StyledListItem = styled.View`
  gap: ${({ theme }) => theme.spacing.xSmall}px;
  padding-vertical: ${({ theme }) => theme.spacing.medium}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background};
`;

export const StyledFieldLabel = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

export const StyledInput = styled.TextInput`
  padding: ${({ theme }) => theme.spacing.small}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.medium}px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 16px;
`;

export const StyledListItemTitle = styled.Text`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
`;

export const StyledListItemMeta = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  line-height: 20px;
`;
