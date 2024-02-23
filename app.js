import { createApp, ref } from 'vue';

const App = {
  setup() {
    const initialValue = 0;
    const outputMaxLength = 10;
    let calculateArr = [];
    let calculateResult = '';
    const outputStr = ref(initialValue);
    const operatorBtn = ref('');
    const message = ref('');

    function handleInput(e) {
      handleClickNumber(e);
      handleClickOperator(e);
    }

    function handleClickNumber(e) {
      const numberRegex = /^[0-9]$/;
      if (numberRegex.test(+e.target.textContent)) {
        if (outputStr.value == initialValue) {
          outputStr.value = e.target.textContent;
        } else if (outputStr.value.toString().length < outputMaxLength) {
          outputStr.value += e.target.textContent;
        }
      }
    }

    function handleClickOperator(e) {
      const operatorRegex = /^[+\-*/]$/;

      if (operatorRegex.test(e.target.textContent.trim())) {
        if (!operatorBtn.value) {
          operatorBtn.value = e.target.textContent.trim();
        }

        if (
          operatorBtn.value &&
          e.target.textContent.trim() !== operatorBtn.value
        )
          return;

        calculateArr.push(Number(outputStr.value));
        outputStr.value = initialValue;
      }
    }

    function handleClickReset() {
      outputStr.value = initialValue;
      operatorBtn.value = '';
      message.value = '';
      calculateArr = [];
      calculateResult = 0;
    }

    function handleDelete() {
      const numberRegex = /^[0-9]$/;

      const delOutput = outputStr.value
        .toString()
        .slice(0, outputStr.value.toString().length - 1);

      outputStr.value = numberRegex.test(delOutput[delOutput.length - 1])
        ? delOutput
        : delOutput.slice(0, delOutput.length - 1);

      message.value = '';
    }

    function handleCalculate(arr) {
      return arr.reduce((acc, cur) => {
        switch (operatorBtn.value) {
          case '+':
            return acc + cur;

          case '-':
            return acc - cur;

          case '*':
            return acc * cur;

          case '/':
            return acc / cur;

          default:
            break;
        }
      });
    }

    function formatResult(number) {
      let numStr = number.toString();

      let parts = numStr.split('.');
      let integerPart = parts[0];
      let decimalPart = parts.length > 1 ? parts[1] : '';

      let sign = '';
      if (integerPart.startsWith('-')) {
        sign = '-';
        integerPart = integerPart.substring(1);
      }

      let nonDotLength = integerPart.length + decimalPart.length;

      if (nonDotLength <= outputMaxLength) {
        return number;
      } else {
        if (integerPart.length >= outputMaxLength) {
          message.value = '錯誤：數值已超過 10 位數';
          return Number(sign + integerPart.substring(0, outputMaxLength));
        }

        let remainDigits = outputMaxLength - integerPart.length;
        return Number(
          sign + integerPart + '.' + decimalPart.substring(0, remainDigits)
        );
      }
    }

    function handleClickEnter() {
      if (!calculateArr.length || !operatorBtn.value) return;

      if (outputStr.value) {
        calculateArr.push(Number(outputStr.value));
        outputStr.value = 0;
      }

      if (operatorBtn.value === '/' && calculateArr.includes(0)) {
        message.value = '錯誤：除數不能為 0，請點擊 Reset 重新計算';
        operatorBtn.value = '';
        return;
      }

      calculateResult = handleCalculate(calculateArr);

      outputStr.value = formatResult(calculateResult).toString();

      operatorBtn.value = '';
      calculateArr = [];
    }

    return {
      outputStr,
      operatorBtn,
      message,
      handleInput,
      handleClickReset,
      handleDelete,
      handleClickEnter,
    };
  },
};
createApp(App).mount('#app');
