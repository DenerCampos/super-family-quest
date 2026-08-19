import {
  Center,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';
import { PREDEFINED_COAT_OF_ARMS } from '../../utils/coatOfArms';

type SelectCoatOfArmsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCoatOfArms: string;
  onSelect: (coatOfArms: string) => void;
};

export const SelectCoatOfArmsModal = ({
  isOpen,
  onClose,
  selectedCoatOfArms,
  onSelect,
}: SelectCoatOfArmsModalProps) => {
  const { t } = useThemedTranslation();
  const { getColor } = useVisualTheme();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent
        bg={getColor('background.primary')}
        color={getColor('text.primary')}
      >
        <ModalHeader>{t('profile.selectCoatOfArms')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <SimpleGrid columns={3} spacing={4}>
            {PREDEFINED_COAT_OF_ARMS.map((image) => (
              <Image
                key={image}
                src={image}
                alt=""
                boxSize="100px"
                objectFit="contain"
                cursor="pointer"
                borderRadius="md"
                border={selectedCoatOfArms === image ? '3px solid' : '1px solid'}
                borderColor={
                  selectedCoatOfArms === image
                    ? getColor('border.selected')
                    : getColor('border.noSelect')
                }
                _hover={{
                  transform: 'scale(1.05)',
                  borderColor: getColor('border.primary'),
                }}
                transition="all 0.2s"
                onClick={() => {
                  onSelect(image);
                  onClose();
                }}
              />
            ))}
          </SimpleGrid>

          <Center mt={6}>
            <Text
              fontSize="sm"
              color={getColor('text.primary')}
              textAlign="center"
            >
              {t('profile.chooseCoatOfArms')}
            </Text>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
