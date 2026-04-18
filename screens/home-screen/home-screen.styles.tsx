import styled from "styled-components/native";

export const StyledContainer = styled.View`
  flex: 1;
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
  flex: 1,
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderTopColor: "#00000033",
  borderBottomColor: "#00000033",
};
