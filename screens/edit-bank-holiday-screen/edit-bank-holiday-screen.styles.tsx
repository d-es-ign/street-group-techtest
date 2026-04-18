import styled from "styled-components/native";

export interface StyledButtonProps {
  variant?: "success" | "accent";
}

export const StyledScreen = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.large}px;
  gap: ${({ theme }) => theme.spacing.small}px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const StyledModalBackdrop = styled.View`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.large}px;
  background-color: rgba(15, 23, 42, 0.4);
`;

export const StyledModalCard = styled.View`
  gap: ${({ theme }) => theme.spacing.medium}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  border-radius: ${({ theme }) => theme.radius.medium}px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const StyledModalBody = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 16px;
`;

export const StyledTitle = styled.Text`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 28px;
  font-weight: 700;
`;

export const StyledFieldLabel = styled.Text`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 16px;
  font-weight: 600;
`;

export const StyledValidationMessage = styled.Text`
  color: ${({ theme }) => theme.colors.error};
  font-size: 14px;
`;

export const StyledTextInput = styled.TextInput`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.textSecondary}33;
  border-radius: ${({ theme }) => theme.radius.medium}px;
  padding: ${({ theme }) => theme.spacing.medium}px;
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.background};
`;

export const StyledDateLabel = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
`;

export const StyledDatePickerContainer = styled.View`
  align-self: flex-start;
  margin-left: -14px;
`;

export const StyledButtonContainer = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.medium}px;
  margin-top: ${({ theme }) => theme.spacing.large}px;
`;

export const StyledModalButtonContainer = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const StyledButton = styled.Pressable<StyledButtonProps>`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, variant }) =>
    variant ? theme.colors[variant] : theme.colors.accent};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-radius: ${({ theme }) => theme.radius.medium}px;
`;

export const StyledButtonLabel = styled.Text`
  color: ${({ theme }) => theme.colors.surface};
  font-size: 16px;
  font-weight: 700;
`;
