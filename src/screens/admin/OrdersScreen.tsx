import React from 'react';
import { connect } from 'react-redux';
import { TableColumnsDefinition, styled, PaginatedTable } from '../../components';
import { requestTableOrdersActionCreator, AppState, OrdersDispatch } from '../../store';
import {
  AdminOrdersTableOrderModel,
  AdminOrdersTableOrderItemModel,
  OrderItemCard,
  ITEMS_PER_PAGE,
  MAX_VISIBLE_PAGES_COUNT,
} from '../../shared';

enum OrdersColumnKey {
  Id,
  UserId,
  CreatedAt,
  CartItems,
  Status,
  Sum,
}

const CardsCell = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const ordersColumnsDefenition: TableColumnsDefinition<AdminOrdersTableOrderModel> = {
  [OrdersColumnKey.Id]: {
    width: 1,
    title: 'Id',
    renderCellItem: (item: AdminOrdersTableOrderModel): JSX.Element => <div>{item.id}</div>,
  },
  [OrdersColumnKey.UserId]: {
    width: 2,
    title: 'User Id',
    renderCellItem: (item: AdminOrdersTableOrderModel): JSX.Element => <div>{item.userId}</div>,
  },
  [OrdersColumnKey.CreatedAt]: {
    width: 2,
    title: 'Created at',
    renderCellItem: (item: AdminOrdersTableOrderModel): JSX.Element => <div>{item.createdAt}</div>,
  },
  [OrdersColumnKey.CartItems]: {
    width: 5,
    title: 'Cart Items',
    renderCellItem: (item: AdminOrdersTableOrderModel): JSX.Element => (
      <CardsCell>
        {item.items.map((orderItem: AdminOrdersTableOrderItemModel) => (
          <OrderItemCard
            key={`${item.id}_${orderItem.product.id}`}
            productName={orderItem.product.name}
            productExtraData={`$${orderItem.orderItemSum}(${orderItem.count}x$${
              orderItem.product.price
            })`}
            imgPath={orderItem.product.img}
          />
        ))}
      </CardsCell>
    ),
  },
  [OrdersColumnKey.Status]: {
    width: 2,
    title: 'Status',
    renderCellItem: (item: AdminOrdersTableOrderModel): JSX.Element => <div>{item.status}</div>,
  },
  [OrdersColumnKey.Sum]: {
    width: 1,
    title: 'Sum',
    renderCellItem: (item: AdminOrdersTableOrderModel): JSX.Element => <div>{item.orderSum}</div>,
  },
};

interface OwnProps {}
interface StateProps {
  orders: AdminOrdersTableOrderModel[];
  totalItemsCount: number;
}
interface DispatchProps {
  onPageChange: (start: number, count: number) => void;
}
type Props = OwnProps & StateProps & DispatchProps;

const OrdersScreenInner = (props: Props): JSX.Element => {
  const { orders, totalItemsCount, onPageChange } = props;

  return (
    <React.Fragment>
      <PaginatedTable
        items={orders}
        itemsPerPage={ITEMS_PER_PAGE}
        maxVisiblePagesCount={MAX_VISIBLE_PAGES_COUNT}
        onPageChange={(page: number) => {
          onPageChange(ITEMS_PER_PAGE * (page - 1), ITEMS_PER_PAGE);
        }}
        tableColumnsDefinition={ordersColumnsDefenition}
        totalItemsCount={totalItemsCount}
      />
    </React.Fragment>
  );
};

const mapStateToProps = (state: AppState) => {
  const { orders } = state;
  return { orders: orders.items, totalItemsCount: orders.totalItemsCount };
};

const mapDispatchToProps = (dispatch: OrdersDispatch) => ({
  onPageChange: (start: number, count: number) => {
    dispatch(requestTableOrdersActionCreator(start, count));
  },
});

export const OrdersScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrdersScreenInner);
