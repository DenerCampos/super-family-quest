import {
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import {
  FiCamera,
  FiDollarSign,
  FiImage,
  FiMic,
  FiPlus,
  FiShoppingBag,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useThemedTranslation } from '../../hooks/useThemedTranslation';
import { useVisualTheme } from '../../hooks/useVisualTheme';

export const HomeQuickActions = () => {
  const { getColor } = useVisualTheme();
  const { t } = useThemedTranslation();
  const navigate = useNavigate();

  return (
    <Flex gap={2} w="full">
      <Menu>
        <MenuButton
          as={Button}
          role="group"
          flex={1}
          size="sm"
          color={getColor('button.text.expense')}
          bg={getColor('button.background.expense')}
          border="1px solid"
          borderColor={getColor('button.border.expense')}
          leftIcon={
            <Icon
              as={FiShoppingBag}
              color={getColor('button.text.expense')}
              _groupHover={{ color: getColor('button.hover.text.inverse') }}
            />
          }
          _hover={{
            bg: getColor('button.hover.background.expense'),
            color: getColor('button.hover.text.inverse'),
            borderColor: getColor('button.hover.border.expense'),
          }}
        >
          {t('home.addExpenseShort')}
        </MenuButton>
        <MenuList>
          <MenuItem icon={<FiPlus />} onClick={() => navigate('/expense')}>
            {t('home.newExpense')}
          </MenuItem>
          <MenuItem icon={<FiCamera />} onClick={() => navigate('/scan')}>
            {t('home.scanQRCode')}
          </MenuItem>
          <MenuItem
            icon={<FiImage />}
            onClick={() => navigate('/image-recognition')}
          >
            {t('home.scanReceipt')}
          </MenuItem>
          <MenuItem
            icon={<FiMic />}
            onClick={() => navigate('/audio-recognition')}
          >
            {t('home.recordAudio')}
          </MenuItem>
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton
          as={Button}
          role="group"
          flex={1}
          size="sm"
          color={getColor('button.text.revenue')}
          bg={getColor('button.background.revenue')}
          border="1px solid"
          borderColor={getColor('button.border.revenue')}
          leftIcon={
            <Icon
              as={FiDollarSign}
              color={getColor('button.text.revenue')}
              _groupHover={{ color: getColor('button.hover.text.inverse') }}
            />
          }
          _hover={{
            bg: getColor('button.hover.background.revenue'),
            color: getColor('button.hover.text.inverse'),
            borderColor: getColor('button.hover.border.revenue'),
          }}
        >
          {t('home.addRevenueShort')}
        </MenuButton>
        <MenuList>
          <MenuItem icon={<FiPlus />} onClick={() => navigate('/revenue')}>
            {t('home.newRevenue')}
          </MenuItem>
          <MenuItem
            icon={<FiImage />}
            onClick={() =>
              navigate('/image-recognition', { state: { from: 'revenue' } })
            }
          >
            {t('home.scanReceipt')}
          </MenuItem>
          <MenuItem
            icon={<FiMic />}
            onClick={() =>
              navigate('/audio-recognition', { state: { from: 'revenue' } })
            }
          >
            {t('home.recordAudio')}
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
