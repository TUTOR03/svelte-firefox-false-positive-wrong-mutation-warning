export function getPropsCreator() {
	const data = $state({ count: 0 });
	function changeData() {
		data.count += 1;
	}

	function createProps() {
		return {
			onclick() {
				changeData();
			}
		};
	}

	return createProps;
}
