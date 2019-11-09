function isValidUUID(str) {
	// const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	let m;

	if ((m = regex.exec(str)) !== null) {
		// The result can be accessed through the `m`-variable.
		m.forEach((match, groupIndex) => {
			console.log(`Found match, group ${groupIndex}: ${match}`);
		});

		return true;
	}

	return false;
}

module.exports.isValidUUID = isValidUUID;
