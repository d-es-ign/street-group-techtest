import styled from "styled-components/native";

export const StyledContainer = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xLarge * 3}px 0;
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
  marginTop: 24,
  flex: 1,
  borderTopWidth: 1,
  borderTopStyle: "solid",
  borderTopColor: "#00000033",
};

export const StyledListItem = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.textSecondary}33;
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
