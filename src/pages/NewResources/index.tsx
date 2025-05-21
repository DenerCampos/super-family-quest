  import { useEffect, useState } from 'react';
  import { Button, Grid, GridItem, Flex, useDisclosure } from '@chakra-ui/react';
  import { Header } from '../../components/Header';
  import { NavigationBar } from '../../components/NavigationBar';
  import { SimpleResourceModal } from '../../components/modals/SimpleResourceModal';
  import { CouponModal } from '../../components/modals/CouponModal';
  import { api } from '../../services';
  import type { Groups, Merchant, Payments } from '../../services/resources';

  const NewResources = () => {
    const [stores, setStores] = useState<Merchant[]>([]);
    const [payments, setPayments] = useState<Payments[]>([]);
    const [groups, setGroups] = useState<Groups[]>([]);

    const {
      isOpen: isSimpleOpen,
      onOpen: onSimpleOpen,
      onClose: onSimpleClose,
    } = useDisclosure();
    const {
      isOpen: isCouponOpen,
      onOpen: onCouponOpen,
      onClose: onCouponClose,
    } = useDisclosure();
    const [currentResource, setCurrentResource] = useState<
      'store' | 'payment' | 'group'
    >('store');

    const loadData = async () => {
      const [storesData, paymentsData, groupsData] = await Promise.all([
        api.resources.getStores(),
        api.resources.getPayments(),
        api.resources.getGroups(),
      ]);
      setStores(storesData);
      setPayments(paymentsData);
      setGroups(groupsData);
    };

    const handleResourceOpen = (
      resource: 'store' | 'payment' | 'group' | 'coupon',
    ) => {
      if (resource === 'coupon') {
        onCouponOpen();
      } else {
        setCurrentResource(resource);
        onSimpleOpen();
      }
    };

    useEffect(() => {
      loadData();
    }, []);

    return (
      <Flex direction="column" minH="100vh">
        <Header />

        <Grid templateColumns="repeat(2, 1fr)" gap={4} p={4} mb="70px">
          <GridItem>
            <Button
              w="full"
              colorScheme="purple"
              onClick={() => handleResourceOpen('store')}
            >
              Nova Loja
            </Button>
          </GridItem>

          <GridItem>
            <Button
              w="full"
              colorScheme="purple"
              onClick={() => handleResourceOpen('payment')}
            >
              Novo Pagamento
            </Button>
          </GridItem>

          <GridItem>
            <Button
              w="full"
              colorScheme="purple"
              onClick={() => handleResourceOpen('group')}
            >
              Novo Grupo
            </Button>
          </GridItem>

          <GridItem>
            <Button
              w="full"
              colorScheme="purple"
              onClick={() => handleResourceOpen('coupon')}
            >
              Novo Cupom
            </Button>
          </GridItem>
        </Grid>

        {isSimpleOpen && !!currentResource && (
          <SimpleResourceModal
            isOpen={isSimpleOpen && !!currentResource}
            onClose={() => {
              onSimpleClose();
              setCurrentResource('store');
            }}
            resourceType={currentResource || 'store'}
            onSuccess={loadData}
          />
        )}

        {isCouponOpen && (
          <CouponModal
            isOpen={isCouponOpen}
            onClose={onCouponClose}
            stores={stores}
            payments={payments}
            groups={groups}
            onSuccess={loadData}
          />
        )}

        <NavigationBar />
      </Flex>
    );
  };

  export default NewResources;