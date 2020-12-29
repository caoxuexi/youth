const CellStatus={
    FORBIDDEN:'forbidden',
    SELECTED:'selected',
    WAITING:'waiting'

}

const ShoppingWay={
    CART:"cart",
    BUY:"buy"
}

const SpuListType={
    THEME:'theme',
    ROOT_CATEGORY:"root_category",
    SUB_CATEGORY:"sub_category",
    LATES:"latest"
}

const AuthAddress = {
    DENY: 'deny',
    NOT_AUTH: 'not_auth',
    AUTHORIZED: 'authorized'
}

const OrderExceptionType = {
    BEYOND_STOCK: 'beyond_stock',
    BEYOND_SKU_MAX_COUNT: 'beyond_sku_max_count',
    BEYOND_ITEM_MAX_COUNT: 'beyond_item_max_count',
    SOLD_OUT: 'sold_out',
    NOT_ON_SALE: 'not_on_sale',
    EMPTY: 'empty'
}

const CouponCenterType = {
    ACTIVITY: 'activity',
    SPU_CATEGORY: 'spu_category'
}

const CouponStatus = {
    CAN_COLLECT: 0,
    AVAILABLE: 1,
    USED: 2,
    EXPIRED: 3
}

export {
    CouponStatus,
    CellStatus,
    ShoppingWay,
    SpuListType,
    AuthAddress,
    OrderExceptionType,
    CouponCenterType
}
