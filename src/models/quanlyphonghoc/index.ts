import { useMemo, useState } from 'react';
import {
	createRoom,
	deleteRoom,
	filterRooms,
	getRooms,
	sortRoomsBySeats,
	updateRoom,
} from '@/services/QuanLyPhongHoc/localStorage.service';
import { RESPONSIBLE_TEACHERS, ROOM_TYPE_OPTIONS } from '@/services/QuanLyPhongHoc/constants';
import { Room, RoomFilters, RoomInput, SeatSortOrder } from '@/services/QuanLyPhongHoc/typing';

interface ActionResult {
	success: boolean;
	message: string;
}

const DEFAULT_FILTERS: RoomFilters = {
	keyword: '',
};

export default () => {
	const [rooms, setRooms] = useState<Room[]>(() => getRooms());
	const [filters, setFilters] = useState<RoomFilters>(DEFAULT_FILTERS);
	const [seatSortOrder, setSeatSortOrder] = useState<SeatSortOrder>('ascend');

	const filteredRooms = useMemo(() => {
		return sortRoomsBySeats(filterRooms(rooms, filters), seatSortOrder);
	}, [rooms, filters, seatSortOrder]);

	const addRoom = (payload: RoomInput): ActionResult => {
		try {
			const nextRooms = createRoom(payload);
			setRooms(nextRooms);
			return { success: true, message: 'Thêm phòng học thành công.' };
		} catch (error: any) {
			return { success: false, message: error?.message || 'Thêm phòng học thất bại.' };
		}
	};

	const editRoom = (roomId: string, payload: RoomInput): ActionResult => {
		try {
			const nextRooms = updateRoom(roomId, payload);
			setRooms(nextRooms);
			return { success: true, message: 'Cập nhật phòng học thành công.' };
		} catch (error: any) {
			return { success: false, message: error?.message || 'Cập nhật phòng học thất bại.' };
		}
	};

	const removeRoom = (roomId: string): ActionResult => {
		try {
			const nextRooms = deleteRoom(roomId);
			setRooms(nextRooms);
			return { success: true, message: 'Xóa phòng học thành công.' };
		} catch (error: any) {
			return { success: false, message: error?.message || 'Xóa phòng học thất bại.' };
		}
	};

	const resetFilters = () => setFilters(DEFAULT_FILTERS);

	return {
		rooms,
		filteredRooms,
		filters,
		seatSortOrder,
		responsibleTeachers: RESPONSIBLE_TEACHERS,
		roomTypeOptions: ROOM_TYPE_OPTIONS,
		setFilters,
		resetFilters,
		setSeatSortOrder,
		addRoom,
		editRoom,
		removeRoom,
	};
};
