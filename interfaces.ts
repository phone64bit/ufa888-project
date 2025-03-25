export interface HotelItem {
    _id: string,
    name: string,
    address: string,
    district: string,
    province: string,
    postalcode: string,
    tel: string,
    dailyRate: number,
    __v: number,
    id: number,
    userRatingCount: number,
    ratingSum: number
  }
  
export interface HotelJson {
    success: boolean,
    count: number,
    pagination: Object,
    data: HotelItem[]
  }

export interface BookingItem {
    nameLastname: string;
    tel: string;
    venue: string;
    bookDate: string;
  }