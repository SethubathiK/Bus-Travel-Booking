import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import RadioInput from '../input/RadioInput';
import Button from '../button/Button';
import Modal from '../Modal/Modal';
import PaymentText from '../input/PaymentText';
import SelectInputText from '../input/SelectInputText';
import { BankCNV } from '../../utils/index.js'
import { useNavigate } from 'react-router-dom';
export default function PaymentForm() {
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        card_number: '',
        expiry_date: '',
        cvv: '',
        card_type: '',
        exp_year: ''
    });
    const [errors, setErrors] = useState({});
    const [isModalVisible, setModalVisible] = useState(false);

    const handleConfirmCancel = () => {
        setModalVisible(false);
        navigate('/bus-booking/BookingPayment/Failed');
    };

    const handleClose = () => {
        setModalVisible(false);
    };

    const inputDataChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        setModalVisible(true);
    };

    const handlePay = async (event) => {
    event.preventDefault();

    let formErrors = {};

    if (!formData.card_type) {
        formErrors.card_type = 'Card type is required';
    }

    if (!formData.expiry_date) {
        formErrors.expiry_date = 'month is required';
    }

    if (!formData.exp_year) {
        formErrors.exp_year = 'Expiration year is required';
    }

    if (!formData.card_number) {
        formErrors.card_number = 'Card number is required';
    }

    if (!formData.cvv) {
        formErrors.cvv = 'CVV is required';
    }

    if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
    }

    try {
        // 🔥 CREATE BOOKING DATA (dummy example)
        const bookingData = {
            journeySummary: {
                routeNo: 101,
                departure: "Chennai",
                arrival: "Salem",
                depotName: "Main Depot",
                seatNo: 23,
                bookingDate: {
                    startTime: "09:00",
                    endTime: "12:00"
                }
            },
            paymentDetails: {
                busFare: "2000",
                convenienceFee: "200",
                bankCharge: "100",
                totalPay: "2300"
            },
            customerDetails: {
                name: "Sethu",
                contactNo: "9876543210",
                email: "test@gmail.com",
                address: "Chennai",
                age: 22,
                nationality: "India"
            }
        };

        const response = await axiosInstance.post(
            "/api/bookings",
            bookingData
        );

        console.log("Booking saved:", response.data);

        navigate('/bus-booking/dashboard');

    } catch (error) {
        console.error("Booking error:", error.response?.data || error);
    }
};
    

    return (
        <>
            <form onSubmit={handlePay} className="sm:space-y-2.5 space-y-3.5 min-w-full ">
                <div className="flex justify-end items-center py-1">
                    <p className="text-sm font-normal tracking-wide align-text-top cursor-pointer">
                        * Required Field
                    </p>
                </div>
                <div className='sm:space-y-2.5 space-y-4'>
                    <RadioInput
                        id="card_type"
                        label="Card Type *"
                        name="card_type"
                        options={[
                            { label: 'Visa', value: 'visa' },
                            { label: 'Mastercard', value: 'mastercard' },
                        ]}
                        value={formData.card_type}
                        onChange={inputDataChange}
                        error={errors.card_type}
                    />
                    <PaymentText
                        id="card_number"
                        name="card_number"
                        label="Card Number *"
                        placeholder="xxxx xxxx xxxx xxxx"
                        value={formData.card_number}
                        onChange={inputDataChange}
                        error={errors.card_number}
                        type="text"  
                    />
                    <div className={`flex flex-row  justify-between  sm:gap-20  sm:items-center`}>
                        <SelectInputText
                            id={formData.expiry_date}
                            name="expiry_date"
                            label="Expiration Month *"
                            value={formData.expiry_date}
                            onChange={inputDataChange}
                            error={errors.expiry_date}
                            planText={'month'}
                            index={10}
                        />
                        <div className='flex-grow '>
                            <PaymentText
                                id="exp_year"
                                name="exp_year"
                                label="Expiration Year *"
                                placeholder="Year"
                                value={formData.exp_year}
                                onChange={inputDataChange}
                                error={errors.exp_year}
                                type="text"  
                                maxLength={4}
                            />
                        </div>
                    </div>
                    <PaymentText
                        id="cvv"
                        name="cvv"
                        label="CVN *"
                        label2="This code is a three or four-digit number printed on the back or front of credit cards."
                        placeholder=""
                        value={formData.cvv}
                        onChange={inputDataChange}
                        error={errors.cvv}
                        type="text"
                        cardType={formData.card_type} 
                        maxLength={4}
                        sourceURL = {BankCNV}
                    />
                </div>
                <div className="flex justify-between items-center min-w-full pt-8 sm:translate-y-0 translate-y-32">
                    <Button
                        Icon={true}
                        label="Cancel"
                        className="bg-red-500  rounded-md  text-black px-8 font-bold tracking-wide text-base"
                        onClick={handleCancel}
                    />
                    <Button
                        Icon={false}
                        label="Pay"
                        className="bg-green-500  rounded-md  text-black px-8 font-bold tracking-wide"
                        onClick={handlePay} 
                    />
                </div>
            </form>
            <Modal
                isVisible={isModalVisible}
                header="Cancel Order"
                body="Are you sure you want to cancel the payment?"
                footer={
                    <>
                        <button
                            onClick={handleClose}
                            className=" sm:px-4 px-5 sm:py-2 bg-gray-300 rounded text-sm font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmCancel}
                            className=" sm:px-4 px-5 py-2 bg-red-500 text-white rounded text-sm font-bold"
                        >
                            Confirm
                        </button>
                    </>
                }
                onClose={handleClose}
            />
        </>
    );
}
