import {
  StyledBody,
  StyledCard,
  StyledContainer,
  StyledTitle,
} from "./home-screen.styles";

export default function HomeScreen() {
  return (
    <StyledContainer>
      <StyledCard>
        <StyledTitle accessibilityRole="header">
          Street Group Tech Test
        </StyledTitle>
        <StyledBody>
          Empty Expo + Expo Router project for Jasper van Es' tech test
          exercise.
        </StyledBody>
      </StyledCard>
    </StyledContainer>
  );
}
