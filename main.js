const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
let hardMode = false;

class Field {
	constructor(field = [[]]) {
		this.field = field;

		//Sets Random Starting Location
		this.locationX = Math.floor(Math.random() * this.field[0].length);
		this.locationY = Math.floor(Math.random() * this.field.length);
		this.field[this.locationY][this.locationX] = pathCharacter;
	}

	// Display Welcome Message and Set Difficulty Level
	welcomeMessage() {
		console.log(
			'Welcome to Find Your Hat! Move your character (*) to its hat (^) without falling into the holes (O). \nTo EXIT at any time, press and hold CTRL + C.\n'
		);
		const enableHardMode = prompt(
			'Would you like to play in "Easy" or "Hard" mode? '
		);

		switch (enableHardMode.toLowerCase()) {
			case 'hard':
				hardMode = true;
				this.field = Field.generateField(15, 12, 0.3);
				this.field[this.locationY][this.locationX] = pathCharacter;
				break;
			default:
				hardMode = false;
				break;
		}
	}

	getDirection() {
		let direction = prompt(
			'Which way would you like to move? ("U", "D", "L" or "R"?) '
		);

		switch (direction.toUpperCase()) {
			case 'U':
				this.locationY -= 1;
				break;
			case 'D':
				this.locationY += 1;
				break;
			case 'R':
				this.locationX += 1;
				break;
			case 'L':
				this.locationX -= 1;
				break;
			default:
				console.log(`Please choose 'U', 'D', 'L', or 'R'`);
				this.getDirection();
				break;
		}
	}

	isHat() {
		return this.field[this.locationY][this.locationX] === hat;
	}

	isHole() {
		return this.field[this.locationY][this.locationX] === hole;
	}

	isInBounds() {
		return (
			this.locationX >= 0 &&
			this.locationY >= 0 &&
			this.locationY < this.field.length &&
			this.locationX < this.field[0].length
		);
	}

	runGame() {
		let playing = true;
		while (playing) {
			this.print();
			this.getDirection();
			if (!this.isInBounds()) {
				console.log('Out of Bounds!');
				playing = false;
				break;
			} else if (this.isHole()) {
				console.log('Sorry, you fell into a hole!');
				playing = false;
				break;
			} else if (this.isHat()) {
				console.log('Congrats! You found your Hat!');
				playing = false;
				break;
			}

			// Update the current location on the map
			this.field[this.locationY][this.locationX] = pathCharacter;

			//adds a hole after every turn in hard mode

			if (hardMode) {
				let randY = Math.floor(Math.random() * this.field.length);
				let randX = Math.floor(Math.random() * this.field[0].length);
				this.field[randY][randX] = hole;
			}
		}
	}

	print() {
		const displayField = this.field
			.map(row => {
				return row.join(' ');
			})
			.join('\n');
		console.log(displayField);
	}

	// Generates game field
	static generateField(height = 7, width = 6, percentage = 0.2) {
		let field = new Array(height);
		for (let i = 0; i < field.length; i++) {
			field[i] = new Array(width);
		}

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const random = Math.random();
				field[y][x] = random < percentage ? hole : fieldCharacter;
			}
		}

		// Set Hat Location
		const hatLocation = {
			x: Math.floor(Math.random() * width),
			y: Math.floor(Math.random() * height),
		};

		// Ensure hat position is not the same as starting position
		while (hatLocation.x === 0 && hatLocation.y === 0) {
			x: Math.floor(Math.random() * width);
			y: Math.floor(Math.random() * height);
		}
		field[hatLocation.y][hatLocation.x] = hat;
		return field;
	}
}

const myField = new Field(Field.generateField());
myField.welcomeMessage();
myField.runGame();
