class Matrix {
	constructor(input, rows, columns, type) {
		this.matrix = [];
		
		switch(type) {
			case "values":
				if(typeof input[0] === "number" && rows == input.length && columns == 1) {
					for(let i = 0; i < input.length; i++) {
						this.matrix.push(new Row([input[i]]));
					}
				} else if(typeof input[0] === "number" && rows == 1 && columns == input.length) {
					this.matrix.push(new Row(input));
				} else {
					for(let i = 0; i < rows; i++) {
						this.matrix.push(new Row(input[i]));		
					}
				} 
				break;
			case "fill":
				for(let i = 0; i < rows; i++) {
					this.matrix.push(new Row(new Array(columns).fill(input)));
				}
				break;
            case "diag":
                for(let i = 0; i < input.length; i++) {
                    let temp = new Array(input.length).fill(0);
                    temp[i] = input[i];
                    this.matrix.push(new Row(temp));
                }
                break;
            case "tridiag":
                for(let i = 0; i < rows; i++) {
                    let temp = new Array(rows).fill(0);
                    for(let j = 0; j < input.length; j++) {
                        let index = i - 1 + j;
                        if(index >= 0 && index < rows) {
                            temp[index] = input[j];
                        }
                    }
                    this.matrix.push(new Row(temp));
                }
                break;
		}
		this.rows = rows;
		this.columns = columns;
	}

    checkAll(value, logic) {
        for(let i = 0; i < this.rows; i++) {
            switch(logic) {
                case "==":
                    if(!this.matrix[i].values.every(x => x == value)) {
                        return false;
                    }
                    break;
                case "<":
                    if(!this.matrix[i].values.every(x => x < value)) {
                        return false;
                    }
                    break;   
            }
        }
        return true;
    }

	display() {
		console.log(this.matrix);
	}

    setTridiagCorners(value) {
        this.matrix[0].values[0] = value;
        this.matrix[this.matrix.length-1].values[this.matrix.length-1] = value;
    }

    transpose() {
        let transpose = new Matrix(0, this.columns, this.rows, "fill");
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.columns; j++) {
                transpose.matrix[j].values[i] = this.matrix[i].values[j];
            }
        }
        return transpose;
    }

    slice(rowStart, rowNum, columnStart, columnNum) {
        let sliced = new Matrix(0, rowNum, columnNum, "fill");
        for(let i = 0; i < rowNum; i++) {
            for(let j = 0; j < columnNum; j++) {
                sliced.matrix[i].values[j] = this.matrix[rowStart+i].values[columnStart+j];
            }
        }
        return sliced;
    }

    add(matrixB) {
        let sum = new Matrix(0, this.rows, this.columns, "fill");
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.columns; j++) {
                sum.matrix[i].values[j] = this.matrix[i].values[j] + matrixB.matrix[i].values[j];
            }
        }
        return sum;
    }

    subtract(matrixB) {
        let difference = new Matrix(0, this.rows, this.columns, "fill");
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.columns; j++) {
                difference.matrix[i].values[j] = this.matrix[i].values[j] - matrixB.matrix[i].values[j];
            }
        }
        return difference;
    }

    multiply(multiplicand) {
        if(typeof multiplicand === "number") {
            let product = new Matrix(0, this.rows, this.columns, "fill");
            for(let i = 0; i < this.rows; i++) {
                product.matrix[i] = new Row(this.matrix[i].values.map(x => x*multiplicand));
            }
            return product;
        } else if(this.columns == multiplicand.rows) {
            let product = new Matrix(0, this.rows, multiplicand.columns, "fill");
            for(let i = 0; i < this.rows; i++) {
                let arrA = this.matrix[i].values;
                for(let j = 0; j < multiplicand.columns; j++) {
                    let arrB = new Array(multiplicand.rows).fill(0);
                    for(let k = 0; k < multiplicand.rows; k++) {
                        arrB[k] = multiplicand.matrix[k].values[j];
                    }
                    product.matrix[i].values[j] = this.dotProduct(arrA, arrB);
                }
            }
            return product;
        } else {
            console.log("Multiplication Error");
        }
    }

    hadamardProduct(multiplicand) {
        let product = new Matrix(0, this.rows, this.columns, "fill");
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.columns; j++) {
                product.matrix[i].values[j] = this.matrix[i].values[j] * multiplicand.matrix[i].values[j];
            }
        }
        return product;
    }

    dotProduct(arrA, arrB) {
        let product = 0;
        for(let i = 0; i < arrA.length; i++) {
            product += arrA[i] * arrB[i];
        }
        return product;
    }

    trig(func) {
        let result = new Matrix(0, this.rows, this.columns, "fill");
        for(let i = 0; i < this.rows; i++) {
            switch(func) {
                case "tanh":
                    result.matrix[i] = new Row(this.matrix[i].values.map(x => Math.tanh(x)));
                    break;
                case "sech":
                    result.matrix[i] = new Row(this.matrix[i].values.map(x => 1/Math.cosh(x)));
                    break;
            }
        }
        return result;
    }

    pow(value) {
        let result = new Matrix(0, this.rows, this.columns, "fill");
        for(let i = 0; i < this.rows; i++) {
             result.matrix[i] = new Row(this.matrix[i].values.map(x => Math.pow(x, value)));
        }
        return result;
    }

    abs() {
        let absVal = new Matrix(0, this.rows, this.columns, "fill");
        for(let i = 0; i < this.rows; i++) {
                absVal.matrix[i] = new Row(this.matrix[i].values.map(x => Math.abs(x)));
        }
        return absVal;
    }

    appendRight(matrixB) {
        let appendedColumns = this.columns + matrixB.columns;
        let appended = new Matrix(0, this.rows, appendedColumns, "fill");
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < appendedColumns; j++) {
                if(j < this.columns) {
                    appended.matrix[i].values[j] = this.matrix[i].values[j];
                } else {
                    appended.matrix[i].values[j] = matrixB.matrix[i].values[j-this.columns];
                }
            }
        }
        return appended;
    }

    appendBottom(matrixB) {
        let appendedRows = this.rows + matrixB.rows;
        let appended = new Matrix(0, appendedRows, this.columns, "fill");
        for(let i = 0; i < appendedRows; i++) {
            for(let j = 0; j < this.columns; j++) {
                if(i < this.rows) {
                    appended.matrix[i].values[j] = this.matrix[i].values[j];
                } else {
                    appended.matrix[i].values[j] = matrixB.matrix[i-this.rows].values[j];
                }
            }
        }
        return appended;
    }

    outputArray() {
        if(this.rows == 1) {
            return this.matrix[0].values;
        }

        let array = [];
        for(var i = 0; i < this.rows; i++) {
            array.push(this.matrix[i].values);
        }
        return array;
    }
}

class Row {
	constructor(arr) {
		this.values = arr;
	}
}

function systemSolver(matrixA, matrixB) {
    let augmented = matrixA.appendRight(matrixB);
    
    //Check that no value is 0 on the diagonal and swap rows to prevent it
    for(let i = 0; i < augmented.rows; i++) {
        if(augmented.matrix[i].values[i] == 0) {
            for(let j = 0; j < augmented.rows; j++) {
                if(i == j) continue;
                if(augmented.matrix[i].values[j] != 0 && augmented.matrix[j].values[i] != 0) {
                    let temp = augmented.matrix[i];
                    augmented.matrix[i] = augmented.matrix[j];
                    augmented.matrix[j] = temp;
                    break;
                }
            }
        }
    }

    //Gaussian elimination
    for(let i = 0; i < augmented.rows - 1; i++) {
        for(let j = i+1; j < augmented.rows; j++) {
            let negMult = -augmented.matrix[j].values[i]/augmented.matrix[i].values[i];
            for(let k = 0; k < augmented.columns; k++) {
                augmented.matrix[j].values[k] += negMult*augmented.matrix[i].values[k];
            }
        }
    }

    //Back substitution
    for(let i = augmented.rows-1; i >= 0; i--) {
        augmented.matrix[i].values = augmented.matrix[i].values.map(x => x/augmented.matrix[i].values[i]);
        if(i == 0) break;
        for(let j = i-1; j >= 0; j--) {
            let negMult = -augmented.matrix[j].values[i]/augmented.matrix[i].values[i];
            for(let k = 0; k < augmented.columns; k++) {
                augmented.matrix[j].values[k] += negMult*augmented.matrix[i].values[k];
            }
        }
    }
    
    let solution = new Matrix(0, augmented.rows, 1, "fill");
    for(var i = 0; i < solution.rows; i++) {
        solution.matrix[i].values[0] = augmented.matrix[i].values[augmented.matrix[i].values.length - 1];
    }

    return solution;
}