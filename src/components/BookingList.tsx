'use client'

import { useState } from "react";
import { useEffect } from "react";
import getBookings from "@/libs/getBookings";
import { useSession } from "next-auth/react";
import DateReserve from "./DateReserve";
import dayjs, { Dayjs } from "dayjs";
import updateBooking from "@/libs/updateBooking";
import deleteBooking from "@/libs/deleteBooking"
import { ToastContainer, toast } from "react-toastify";

export default function BookingList() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [checkInDate, setCheckInDate] = useState<Dayjs|null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Dayjs|null>(null);

    const { data:session } = useSession();

    if(!session) return (<div></div>)

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await getBookings(session.user.token);

                if(!response) throw new Error("Failed to fetch data.");

                setItems(response);
                
            } catch(err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchItems();

    }, []);

    const handleUpdateBooking = async (bookingId: string) => {
        if(checkInDate && session && checkOutDate) {
            const response = await updateBooking(bookingId, session.user.token, checkInDate.format("YYYY-MM-DD"), checkOutDate.format("YYYY-MM-DD"));
            if(response.success == true) {
                toast.success("Update Booking Successfully.");
            } else toast.error(response.message ? response.message : `An Error has occurred while update booking.`);
        } else toast.error("Invalid Date or Session.");
    }
    const handleDeleteBooking = async (bookingId: string) => {
        if(session) {
            const response = await deleteBooking(bookingId, session.user.token);
            if(response.success == true) {
                toast.success("Delete Booking Successfully.");
            } else toast.error(response.message ? response.message : `An Error has occurred while delete booking.`);
        } else toast.error("Invalid Session.");
    }

    if(loading) return (<div></div>)

    return (
        <div>
            {
                items.data.length == 0 ? "No Venue Booking"
                : items.data.map((item) => (
                    <div className="bg-slate-200 rounded px-5 mx-5 py-2 my-2" key={item._id}>
                        <div className="text-xl text-black font-bold">
                            {item.hotel ? item.hotel.name : `Unknown Hotel`}
                        </div>
                        <div className="text-md text-black">
                            Booking Time: {new Date(item.createdAt).toString()}
                        </div>
                        <div className="flex flex-row gap-3">
                            <div>
                                <div className="text-md text-black">Check-In Date</div>
                                <DateReserve defaultDate={dayjs(new Date(item.checkInDate))} onDateChange={(value:Dayjs)=>{setCheckInDate(value);}}/>
                            </div>
                            <div>
                                <div className="text-md text-black">Check-Out Date</div>
                                <DateReserve defaultDate={dayjs(new Date(item.checkOutDate))} onDateChange={(value:Dayjs)=>{setCheckOutDate(value);}}/>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 mt-[3px]">
                            <button className="block rounded-md bg-lime-600 hover:bg-indigo-600 px-3 py-1 text-white shadow-sm duration-300" 
                            onClick={() => handleUpdateBooking(item._id)}>
                                Update
                            </button>
                            <button className="block rounded-md bg-red-600 hover:bg-indigo-600 px-3 py-1 text-white shadow-sm duration-300" 
                            onClick={() => handleDeleteBooking(item._id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            }
            <ToastContainer/>
        </div>
    )
}