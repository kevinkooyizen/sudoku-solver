<template>
    <main>
        <ul>
            <li v-for="cell in cells">
                <span @click="getProperties(cell)">{{ cell.value }}</span>
            </li>
        </ul>
        <div class="note">Your browser doesn't support CSS Grid. You'll need <a href="http://gridbyexample.com/browsers/">a browser that does</a> to use this app.</div>
    </main>
</template>

<script>
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
            }
        },

        computed: {

        },

        methods: {
            validateBlock(cell) {

            },

            validateRow(cell) {

            },

            validateColumn(cell) {

            },

            getProperties(cell) {
                let block = 'block: ' + this.getBlock(cell);
                let row = 'row: ' + this.getRow(cell);
                let column = 'column: ' + this.getColumn(cell);
            },

            /*Get which block the cell resides in*/
            getBlock(cell) {
                let row = this.getRow(cell);
                let column = this.getColumn(cell);
                let block = this.eleInArray(this.blocks, row, 'rows', column, 'columns')
                return block.id;
            },

            /*Get which row the cell resides in*/
            getRow(cell) {
                let row = 1;
                let cellId = cell.id;
                while (cellId.toString().length > 1) {
                    row ++
                    cellId -= 9;
                }
                return row;
            },

            /*Get which column the cell resides in*/
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
            arrayValueExists: function (array, searchValue, parameter, searchValue2, parameter2) {
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
            eleInArray: function (array, searchValue, parameter, searchValue2, parameter2) {
                let element = {};
                if (this.arrayValueExists(array, searchValue, parameter, searchValue2, parameter2)) {
                    element = array.find(x => x[parameter].includes(searchValue)  && x[parameter2].includes(searchValue2));
                }
                return element;
            },
        },
        created() {
            for(let i = 1; i <= 81; i++) {
                this.cells.push({id: i, value: i});
            }
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
        grid-template-columns: repeat(9, 5vw);
        grid-template-rows: repeat(9, 5vw);
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
