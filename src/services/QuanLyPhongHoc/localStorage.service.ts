import { DEFAULT_ROOMS, RESPONSIBLE_TEACHERS, ROOM_STORAGE_KEY } from './constants';
import { Room, RoomFilters, RoomInput, SeatSortOrder } from './typing';

const normalize = (value: string) => value.trim().toLowerCase();

const isBlank = (value?: string) => !value || !value.trim();

const createRoomRecord = (input: RoomInput): Room => ({
	...input,
	maPhong: input.maPhong.trim(),
	tenPhong: input.tenPhong.trim(),
	nguoiPhuTrach: input.nguoiPhuTrach.trim(),
	id: `room_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
	createdAt: new Date().toISOString(),
});

const validateRoomInput = (input: RoomInput) => {
	if (isBlank(input.maPhong)) throw new Error('Mã phòng không được để trống.');
	if (input.maPhong.trim().length > 10) throw new Error('Mã phòng tối đa 10 ký tự.');
	if (isBlank(input.tenPhong)) throw new Error('Tên phòng không được để trống.');
	if (input.tenPhong.trim().length > 50) throw new Error('Tên phòng tối đa 50 ký tự.');
	if (isBlank(input.nguoiPhuTrach)) throw new Error('Người phụ trách không được để trống.');
	if (!RESPONSIBLE_TEACHERS.includes(input.nguoiPhuTrach)) {
		throw new Error('Người phụ trách không hợp lệ.');
	}
	if (!Number.isInteger(input.soChoNgoi)) throw new Error('Số chỗ ngồi phải là số nguyên.');
	if (input.soChoNgoi < 10 || input.soChoNgoi > 200) {
		throw new Error('Số chỗ ngồi phải trong khoảng 10 đến 200.');
	}
};

const parseRooms = (value: string | null): Room[] => {
	if (!value) return [];
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : [];
	} catch (error) {
		return [];
	}
};

const persistRooms = (rooms: Room[]) => {
	localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(rooms));
};

const ensureSeedData = (): Room[] => {
	const existing = parseRooms(localStorage.getItem(ROOM_STORAGE_KEY));
	if (existing.length > 0) return existing;
	const seeded = DEFAULT_ROOMS.map((item) => createRoomRecord(item));
	persistRooms(seeded);
	return seeded;
};

const validateUnique = (rooms: Room[], input: RoomInput, excludeId?: string) => {
	const hasDuplicateCode = rooms.some(
		(room) => room.id !== excludeId && normalize(room.maPhong) === normalize(input.maPhong),
	);
	if (hasDuplicateCode) throw new Error('Mã phòng đã tồn tại.');

	const hasDuplicateName = rooms.some(
		(room) => room.id !== excludeId && normalize(room.tenPhong) === normalize(input.tenPhong),
	);
	if (hasDuplicateName) throw new Error('Tên phòng đã tồn tại.');
};

export const getRooms = (): Room[] => ensureSeedData();

export const createRoom = (input: RoomInput): Room[] => {
	validateRoomInput(input);
	const current = getRooms();
	validateUnique(current, input);
	const next = [createRoomRecord(input), ...current];
	persistRooms(next);
	return next;
};

export const updateRoom = (roomId: string, input: RoomInput): Room[] => {
	validateRoomInput(input);
	const current = getRooms();
	const target = current.find((item) => item.id === roomId);
	if (!target) throw new Error('Không tìm thấy phòng học cần cập nhật.');
	validateUnique(current, input, roomId);

	const next = current.map((item) =>
		item.id === roomId
			? {
					...item,
					...input,
					maPhong: input.maPhong.trim(),
					tenPhong: input.tenPhong.trim(),
					nguoiPhuTrach: input.nguoiPhuTrach.trim(),
					updatedAt: new Date().toISOString(),
			  }
			: item,
	);

	persistRooms(next);
	return next;
};

export const deleteRoom = (roomId: string): Room[] => {
	const current = getRooms();
	const target = current.find((item) => item.id === roomId);
	if (!target) throw new Error('Không tìm thấy phòng học cần xóa.');
	if (target.soChoNgoi >= 30) {
		throw new Error('Chỉ được xóa phòng có dưới 30 chỗ ngồi.');
	}

	const next = current.filter((item) => item.id !== roomId);
	persistRooms(next);
	return next;
};

export const filterRooms = (rooms: Room[], filters: RoomFilters): Room[] => {
	return rooms.filter((room) => {
		const keyword = filters.keyword?.trim();
		if (keyword) {
			const matchedKeyword =
				normalize(room.maPhong).includes(normalize(keyword)) || normalize(room.tenPhong).includes(normalize(keyword));
			if (!matchedKeyword) return false;
		}

		if (filters.loaiPhong && room.loaiPhong !== filters.loaiPhong) return false;
		if (filters.nguoiPhuTrach && room.nguoiPhuTrach !== filters.nguoiPhuTrach) return false;

		if (filters.maPhong && !normalize(room.maPhong).includes(normalize(filters.maPhong))) return false;
		if (filters.tenPhong && !normalize(room.tenPhong).includes(normalize(filters.tenPhong))) return false;

		if (typeof filters.minSeats === 'number' && room.soChoNgoi < filters.minSeats) return false;
		if (typeof filters.maxSeats === 'number' && room.soChoNgoi > filters.maxSeats) return false;

		return true;
	});
};

export const sortRoomsBySeats = (rooms: Room[], order: SeatSortOrder): Room[] => {
	const sorted = [...rooms].sort((a, b) => a.soChoNgoi - b.soChoNgoi);
	return order === 'descend' ? sorted.reverse() : sorted;
};
