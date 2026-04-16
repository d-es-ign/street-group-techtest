import styled from "styled-components/native";

export const StyledContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const StyledCard = styled.View`
  width: 100%;
  max-width: 420px;
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
