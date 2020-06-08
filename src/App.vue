<template>
  <main>
    <ul class="mt-5">
      <li v-for="(cell,cellIndex) in cells" :key="cellIndex">
        <input :id="cell.id" v-model="cells[cellIndex].value" :disabled="solving" @keypress="isNumber">
      </li>
    </ul>
    <div class="d-flex justify-content-center">
      <button @click="validateAndSolveCells" class="btn btn-success" :disabled="solving">
        <span v-show="solving"><i class="fas fa-spinner fa-spin"></i></span>
        <span v-if="solving">&nbsp;Solving</span>
        <span v-else>Solve</span>
      </button>
    </div>
    <div class="d-flex justify-content-center mt-3">
      <button @click="resetCells" class="btn btn-primary" :disabled="solving">
        Reset Board
      </button>
    </div>
    <div class="note">Your browser doesn't support CSS Grid. You'll need <a href="http://gridbyexample.com/browsers/">a browser that does</a> to use this app.</div>
  </main>
</template>

<script>
  const delay = ms => new Promise(res => setTimeout(res, ms));

  export default {
    data () {
      return {
        cells: [],
        blocks: [
          {
            id: 1,
            rows: [1,2,3],
            columns: [1,2,3],
          },
          {
            id: 2,
            rows: [1,2,3],
            columns: [4,5,6],
          },
          {
            id: 3,
            rows: [1,2,3],
            columns: [7,8,9],
          },
          {
            id: 4,
            rows: [4,5,6],
            columns: [1,2,3],
          },
          {
            id: 5,
            rows: [4,5,6],
            columns: [4,5,6],
          },
          {
            id: 6,
            rows: [4,5,6],
            columns: [7,8,9],
          },
          {
            id: 7,
            rows: [7,8,9],
            columns: [1,2,3],
          },
          {
            id: 8,
            rows: [7,8,9],
            columns: [4,5,6],
          },
          {
            id: 9,
            rows: [7,8,9],
            columns: [7,8,9],
          },
        ],
        failedAttempts: [],
        attempts: [],
        delayTime: 10,
        solving: false,
        cellInputs: [],
      }
    },

    computed: {
      solved() {
        for (const cellKey in this.cells) {
          if (!Object.hasOwnProperty.call(this.cells, cellKey)) {
            continue;
          }
          if (!this.cells[cellKey].value) {
            return false;
          }
        }
        return true;
      }
    },

    methods: {

      // Only allow input of numbers
      isNumber: function (evt) {
        evt = (evt) ? evt : window.event;
        let charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
          evt.preventDefault();
        } else {
          return true;
        }
      },

      /**
       * Attempt to solve sudoku board
       */
      async solve() {
        try {
          this.solving = true;
          if (this.solved) {
            return;
          }

          for (const cellKey in this.cells) {

            if (!Object.hasOwnProperty.call(this.cells, cellKey) || this.cells[cellKey].value !== '') {
              continue;
            }
            let cell = this.cells[cellKey];
            cell.value = 1; // Start at 1

            // Check if value that is about to be inserted is valid
            while (!this.validateCell(cell) || this.failedAttempts.includes(JSON.stringify(this.cells))) {
              cell.value ++;
            }

            // Invalid attempt
            if (cell.value > 9) {
              // Store failed value of current attempt
              cell.value = '';
              this.failedAttempts.push(JSON.stringify(this.cells));

              // Return to previous attempts until finding a fresh attempt that is not a failed attempt
              let count = 1;
              this.cells = JSON.parse(this.attempts[this.attempts.length - count]);

              while (this.failedAttempts.includes(JSON.stringify(this.cells))) {
                count++;
                this.cells = JSON.parse(this.attempts[this.attempts.length - count]);
              }
              await this.solve();
            }

            this.attempts.push(JSON.stringify(this.cells));

            await delay(this.delayTime);
          }
        }
        finally {
          this.solving = false;
        }
      },

      /**
       * Get values in block
       * @param block
       * @returns {array}
       */
      valuesInBlock(block) {
        let values = [];
        for (const cellKey in this.cells) {
          if (!Object.hasOwnProperty.call(this.cells, cellKey) || this.cells[cellKey].value === '') {
            continue;
          }
          if (this.getBlock(this.cells[cellKey]) === block) {
            values.push(parseInt(this.cells[cellKey].value));
          }
        }
        return values;
      },

      /**
       * Validate block values in cell
       * @param cell
       * @returns {boolean}
       */
      validateBlock(cell) {
        let block = this.getBlock(cell);
        let valuesInBlock = this.valuesInBlock(block);
        return !this.hasDuplicates(valuesInBlock);
      },

      /**
       * Get values in row
       * @param row
       * @returns {array}
       */
      valuesInRow(row) {
        let values = [];
        for (const cellKey in this.cells) {
          if (!Object.hasOwnProperty.call(this.cells, cellKey) || this.cells[cellKey].value === '') {
            continue;
          }
          if (this.getRow(this.cells[cellKey]) === row) {
            values.push(parseInt(this.cells[cellKey].value));
          }
        }
        return values;
      },

      /**
       * Validate row values in cell
       * @param cell
       * @returns {boolean}
       */
      validateRow(cell) {
        let row = this.getRow(cell);
        let valuesInRow = this.valuesInRow(row);
        return !this.hasDuplicates(valuesInRow);
      },

      /**
       * Get values in column
       * @param column
       * @returns {array}
       */
      valuesInColumn(column) {
        let values = [];
        for (const cellKey in this.cells) {
          if (!Object.hasOwnProperty.call(this.cells, cellKey) || this.cells[cellKey].value === '') {
            continue;
          }
          if (this.getColumn(this.cells[cellKey]) === column) {
            values.push(parseInt(this.cells[cellKey].value));
          }
        }
        return values;
      },

      /**
       * Validate column values in cell
       * @param cell
       * @returns {boolean}
       */
      validateColumn(cell) {
        let column = this.getColumn(cell);
        let valuesInColumn = this.valuesInColumn(column);
        return !this.hasDuplicates(valuesInColumn);
      },

      validateCell(cell) {
        return !(!this.validateBlock(cell) || !this.validateRow(cell) || !this.validateColumn(cell));
      },

      /**
       * Get which block the cell resides in
       * @param cell
       * @returns {int}
       */
      getBlock(cell) {
        let row = this.getRow(cell);
        let column = this.getColumn(cell);
        let block = this.eleInArray(this.blocks, row, 'rows', column, 'columns')
        return block.id;
      },

      /**
       * Get which row the cell resides in
       * @param cell
       * @returns {int}
       */
      getRow(cell) {
        let row = 1;
        let cellId = cell.id;
        while (cellId.toString().length > 1) {
          row ++
          cellId -= 9;
        }
        return row;
      },

      /**
       * Get which column the cell resides in
       * @param cell
       * @returns {int}
       */
      getColumn(cell) {
        let cellId = this.reduceToSingleDigit(cell.id);
        if (cellId % 9 === 0) {
          return 9;
        } else if (cellId % 8 === 0) {
          return 8;
        } else if (cellId % 7 === 0) {
          return 7;
        } else if (cellId % 6 === 0) {
          return 6;
        } else if (cellId % 5 === 0) {
          return 5;
        } else if (cellId % 4 === 0) {
          return 4;
        } else if (cellId % 3 === 0) {
          return 3;
        } else if (cellId % 2 === 0) {
          return 2;
        }
        return 1;
      },

      /**
       * Reduce to single digit to get cell position
       * @param cell
       * @returns {int}
       */
      reduceToSingleDigit(cell) {
        while (cell.toString().length > 1) {
          cell -= 9;
        }
        return cell;
      },

      /**
       * Check if value exists in array using defined parameter
       * @param array
       * @param searchValue
       * @param parameter
       * @param searchValue2
       * @param parameter2
       * @returns {boolean}
       */
      arrayValueExists(array, searchValue, parameter, searchValue2, parameter2) {
        return !!array.find(x => x[parameter].includes(searchValue)  && x[parameter2].includes(searchValue2));

      },

      /**
       * Return element in array based on search parameter
       * @param array
       * @param searchValue
       * @param parameter
       * @param searchValue2
       * @param parameter2
       * @returns {*}
       */
      eleInArray(array, searchValue, parameter, searchValue2, parameter2) {
        let element = {};
        if (this.arrayValueExists(array, searchValue, parameter, searchValue2, parameter2)) {
          element = array.find(x => x[parameter].includes(searchValue)  && x[parameter2].includes(searchValue2));
        }
        return element;
      },

      /**
       * Check if array has duplicates
       * @param array
       * @returns {boolean}
       */
      hasDuplicates(array) {
        return new Set(array).size !== array.length;
      },

      /**
       * Clear all cells
       */
      resetCells() {
        this.failedAttempts = [];
        this.attempts = [];
        this.cells = [];
        for (let i = 1; i <= 81; i++) {
          this.cells.push({id: i, value: ''});
        }
      },

      /**
       * Validate and solve all cells
       */
      validateAndSolveCells() {
        for (let i = 0; i < 81; i++) {
          let cell = this.cells[i];
          if (!this.validateCell(cell)) {
            alert('Invalid board');
            return;
          }
        }
        this.solve();
      },
    },

    watch: {
      cells: {
        handler() {
          for (let i = 0; i < 81; i++) {
            let cellValue = parseInt(this.cells[i].value);
            if (cellValue > 9 || cellValue === 0) {
              this.cells = JSON.parse(this.cellInputs[this.cellInputs.length - 1]);
              return;
            }
          }

          if (!this.cellInputs.includes(JSON.stringify(this.cells))) {
            this.cellInputs.push(JSON.stringify(this.cells));
          }
        },
        deep: true,
      }
    },

    created() {
      this.resetCells();
    }
  }
</script>

<style>
  body{
    font-family: Avenir, Heveltica, sans-serif;
  }
  li:nth-child(n):nth-child(-n+9) {
    border-top-width: 4px;
  }
  li:nth-child(n+73):nth-child(-n+81) {
    border-bottom-width: 4px;
  }
  li:nth-child(3n) {
    border-right-width: 4px;
  }
  li:nth-child(9n+1) {
    border-left-width: 4px;
  }
  li:nth-child(n+19):nth-child(-n+27) {
    border-bottom-width: 4px;
  }
  li:nth-child(n+46):nth-child(-n+54) {
    border-bottom-width: 4px;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(9, 4vw);
    grid-template-rows: repeat(9, 4vw);
    justify-content: center;
    align-content: center;
    grid-gap: 0rem;
    list-style: none;
    margin: 0 0 2vw;
    padding: 0;
    font-size: calc(2vw + 10px);
  }
  li {
    margin: 0;
    padding: 0;
    text-align: center;
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    margin-top: 0.4rem;
  }

  input {
    flex: 1;
    min-width: 2rem;
    text-align: center;
    border: none;
    outline: none;
    height: 90%;
    transition: all .24s ease-in-out;
  }

  .note {
    background: #ddd;
    font-family: monospace;
    padding: 2em 5em;
    font-size: 120%;
    order: -1;
  }
  @supports (display:grid) {
    .note {display:none;}
  }
</style>
