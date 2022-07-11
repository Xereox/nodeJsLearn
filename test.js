let list = {
	value: 1,
	next: {
		value: 2,
		next: {
			value: 3,
			next: {
				value: 4,
				next: null,
			},
		},
	},
};

const find = (list, value) =>
	list.value === value ? list : list.next ? find(list.next, value) : null;
console.log(find(list, 3));
