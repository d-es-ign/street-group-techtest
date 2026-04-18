import {
  ComponentRef,
  ComponentType,
  createElement,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Easing } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { SvgProps } from "react-native-svg";

import CalendarIcon from "@/assets/svg/calendar.svg";
import ChevronRightIcon from "@/assets/svg/chevron-right.svg";
import DeleteIcon from "@/assets/svg/delete.svg";
import EditIcon from "@/assets/svg/edit.svg";
import MenuIcon from "@/assets/svg/menu.svg";
import { BankHolidayStateEvent } from "@/domains/bank-holidays/types";

import {
  StyledActionButton,
  StyledActionButtonLabel,
  StyledActionButtons,
  StyledActionContent,
  StyledListItem,
  StyledListItemContent,
  StyledListItemContentPressable,
  StyledListItemDate,
  StyledListItemInner,
  StyledListItemMenuButton,
  StyledListItemTitle,
  StyledListItemTrailingIcon,
} from "./swipeable-item.styles";

const SvgMockFallback = (props: SvgProps) => {
  return createElement("SvgMock", props);
};

const getSvgComponent = (icon: unknown) => {
  const resolvedIcon = icon as
    | ComponentType<SvgProps>
    | {
        default?: ComponentType<SvgProps>;
      };

  if (typeof resolvedIcon === "function") {
    return resolvedIcon;
  }

  if (typeof resolvedIcon.default === "function") {
    return resolvedIcon.default;
  }

  return SvgMockFallback;
};

const CalendarSvg = getSvgComponent(CalendarIcon);
const ChevronRightSvg = getSvgComponent(ChevronRightIcon);
const DeleteSvg = getSvgComponent(DeleteIcon);
const EditSvg = getSvgComponent(EditIcon);
const MenuSvg = getSvgComponent(MenuIcon);

interface SwipeableItemProps {
  bankHoliday: BankHolidayStateEvent;
  onEdit: (bankHoliday: BankHolidayStateEvent) => void;
  onDelete: (bankHoliday: BankHolidayStateEvent) => void;
  onSave: (bankHoliday: BankHolidayStateEvent) => void;
}

export const SwipeableItem = ({
  bankHoliday,
  onEdit,
  onDelete,
  onSave,
}: SwipeableItemProps) => {
  const [isShowingActions, setIsShowingActions] = useState(false);
  const swipeableRef = useRef<ComponentRef<typeof Swipeable>>(null);
  const contentTranslateX = useMemo(() => new Animated.Value(0), []);
  const contentHintAnimationRef = useRef<Animated.CompositeAnimation | null>(
    null,
  );

  const handleActionPress = (
    action: (bankHoliday: BankHolidayStateEvent) => void,
  ) => {
    swipeableRef.current?.close?.();
    setIsShowingActions(false);
    action(bankHoliday);
  };

  const triggerContentHint = () => {
    if (isShowingActions) {
      return;
    }

    contentHintAnimationRef.current?.stop();
    contentTranslateX.setValue(0);

    const contentHintAnimation = Animated.sequence([
      Animated.timing(contentTranslateX, {
        duration: 90,
        easing: Easing.out(Easing.quad),
        toValue: -8,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateX, {
        duration: 120,
        easing: Easing.inOut(Easing.quad),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]);

    contentHintAnimationRef.current = contentHintAnimation;
    contentHintAnimation.start(({ finished }) => {
      if (!finished || contentHintAnimationRef.current !== contentHintAnimation) {
        return;
      }

      contentHintAnimationRef.current = null;
    });
  };

  return (
    <Swipeable
      ref={swipeableRef}
      onSwipeableClose={() => setIsShowingActions(false)}
      onSwipeableOpen={() => setIsShowingActions(true)}
      renderRightActions={() => {
        return (
          <StyledActionButtons>
            <StyledActionButton
              variant="success"
              onPress={() => handleActionPress(onSave)}
            >
              <StyledActionContent>
                <CalendarSvg
                  fill="white"
                  height={20}
                  testID="calendar-icon"
                  width={20}
                />
                <StyledActionButtonLabel>Add</StyledActionButtonLabel>
              </StyledActionContent>
            </StyledActionButton>
            <StyledActionButton onPress={() => handleActionPress(onEdit)}>
              <StyledActionContent>
                <EditSvg
                  fill="white"
                  height={20}
                  testID="edit-icon"
                  width={20}
                />
                <StyledActionButtonLabel>Edit</StyledActionButtonLabel>
              </StyledActionContent>
            </StyledActionButton>
            <StyledActionButton
              variant="error"
              onPress={() => handleActionPress(onDelete)}
            >
              <StyledActionContent>
                <DeleteSvg
                  fill="white"
                  height={20}
                  testID="delete-icon"
                  width={20}
                />
                <StyledActionButtonLabel>Delete</StyledActionButtonLabel>
              </StyledActionContent>
            </StyledActionButton>
          </StyledActionButtons>
        );
      }}
    >
      <StyledListItem>
        <StyledListItemInner
          style={{ transform: [{ translateX: contentTranslateX }] }}
        >
          <StyledListItemContentPressable
            onPress={triggerContentHint}
            testID="swipeable-item-content"
          >
            <StyledListItemContent>
              <StyledListItemTitle>{bankHoliday.title}</StyledListItemTitle>
              <StyledListItemDate>{bankHoliday.date}</StyledListItemDate>
            </StyledListItemContent>
          </StyledListItemContentPressable>
          <StyledListItemTrailingIcon>
            {isShowingActions ? (
              <ChevronRightSvg
                fill="black"
                height={24}
                testID="chevron-right-icon"
                width={24}
              />
            ) : (
              <StyledListItemMenuButton
                onPress={triggerContentHint}
                testID="swipeable-item-menu-button"
              >
                <MenuSvg
                  fill="black"
                  height={24}
                  testID="menu-icon"
                  width={24}
                />
              </StyledListItemMenuButton>
            )}
          </StyledListItemTrailingIcon>
        </StyledListItemInner>
      </StyledListItem>
    </Swipeable>
  );
};
