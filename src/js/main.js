import MetricForm from "./MetricForm.js"
import ImperialForm from "./ImperialForm.js"

class Form {
	constructor() {
		this.form = document.querySelector('.form')
		this.state = 'metric'
		this.switchBtnsParentEl = document.querySelector('.hero__box-btns')
        this.resultEl = document.querySelector('.hero__result')
		this.switchBtnsParentEl.addEventListener('click', this.metricSystemHandler.bind(this))
		this.imperialForm = new ImperialForm(this.form)
		this.metricForm = new MetricForm(this.form)
		this.togglingForms()
		this.form.addEventListener('submit', this.handlingForm.bind(this))
		this.bmi
		this.formIsValid = true
		this.errMsg
		this.inputsListener()
	}

    renderWelcomeText(){

        const welcomeText = `
            <div class="welcome-text">
                <h5>Welcome!</h5>
                <p>Enter your height and weight and you'll see your BMI result</p>
            </div>
        `

        this.resultEl.innerHTML = ''

        this.resultEl.insertAdjacentHTML('beforeend', welcomeText)

    }

    togglingForms() {
		if (this.state === 'imperial') {
			this.imperialForm.createImperialForm()
			this.inputsListener()
		} else {
			this.metricForm.createMetricForm()
		}

        this.renderWelcomeText()
	}

	metricSystemHandler(e) {
		const btns = this.switchBtnsParentEl.querySelectorAll('.btn-switch')
		btns.forEach(btn => btn.classList.toggle('checked'))

		this.form.innerHTML = ''

		e.target.dataset.system === 'imperial' ? (this.state = 'imperial') : (this.state = 'metric')

		console.log(this.state)

		this.togglingForms()
	}

	checkBMIStatus(bmi) {
		if (bmi < 18.5) {
			this.bmiStatus = 'underweight'
			this.bmiRange = 'below 18.5'
		}
		if (bmi >= 18.5 && bmi <= 24.9) {
			this.bmiStatus = 'healthy weight'
			this.bmiRange = '18.5 to 24.9'
		}
		if (bmi >= 25.0 && bmi <= 29.9) {
			this.bmiStatus = 'overweight'
			this.bmiRange = '25.0 to 29.9'
		}
		if (bmi >= 30) {
			this.bmiStatus = 'obesity'
			this.bmiRange = 'above 30'
		}
	}

	checkIdealWeight(bmi, height) {
		// reference
		// https://www.verywellfit.com/ideal-weight-calculator-chart-3878254
		this.idealWeight = (2.2 * bmi + 3.5 * bmi * (height - 1.5)).toFixed(1)
	}

	calcBMI() {
		const formData = [...new FormData(this.form)]
		const formObj = Object.fromEntries(formData)

		let height
		let weight

		if (this.state === 'metric') {
			height = formObj.height / 100
			weight = formObj.weight
		}

		if (this.state === 'imperial') {
			// converting values into metric system

			// height

			// feets only
			if (formObj['height-ft'] && !formObj['height-in']) {
				height = (formObj['height-ft'] * 0.3048).toFixed(2)
			}

			// inches only
			if (!formObj['height-ft'] && formObj['height-in']) {
				height = (formObj['height-in'] * 0.0254).toFixed(2)
			}

			// feets and inches
			if (formObj['height-ft'] && formObj['height-in']) {
				height = (formObj['height-ft'] * 0.3048 + formObj['height-in'] * 0.0254).toFixed(2)
				console.log(height)
			}

			// width
			// stones only
			if (formObj['weight-st'] && !formObj['weight-lbs']) {
				weight = (formObj['weight-st'] * 6.3503).toFixed(2)
				console.log(weight)
			}

			// pounds only
			if (!formObj['weight-st'] && formObj['weight-lbs']) {
				weight = (formObj['weight-lbs'] * 0.45359237).toFixed(2)
			}

			// stones and pounds
			if (formObj['weight-st'] && formObj['weight-lbs']) {
				weight = (formObj['weight-st'] * 6.3503 + formObj['weight-lbs'] * 0.45359237).toFixed(2)
				console.log(weight)
			}
		}

		this.bmi = (weight / Math.pow(height, 2)).toFixed(1)

		this.checkIdealWeight(this.bmi, height)
	}
    
    formStateHandler(bool, text = ''){
        this.formIsValid = bool
        this.errMsg.textContent = text

        bool === true ? this.errMsg.classList.add('display-none') : this.errMsg.classList.remove('display-none')
        
    }

	metricIsValid() {
		const formData = [...new FormData(this.form)]

		formData.forEach(input => {
			this.errMsg = this.form.querySelector(`#${input[0]}`).parentElement.nextElementSibling

            const invalidMsg = `${
                input[0][0].toUpperCase() + input[0].slice(1)
            } field needs to be a number grater than 0`

			// invalid value
			if (input[1].trim() === '' || Number(input[1]) === 0 || isNaN(input[1])) {
				this.formStateHandler(false, invalidMsg)
				return
			}

            this.formStateHandler(true)
		})
	}

	imperialIsValid() {
		const formData = [...new FormData(this.form)]
		const formObj = Object.fromEntries(formData)

		formData.forEach(input => {
			console.log(input[1])
			const heightIsEmpty = !formObj['height-ft'] && !formObj['height-in']
			const weightIsEmpty = !formObj['weight-st'] && !formObj['weight-lbs']

			const heightZero = Number(formObj['height-ft']) === 0 && Number(formObj['height-in']) === 0
			const weightZero = Number(formObj['weight-st']) === 0 && Number(formObj['weight-lbs']) === 0

			const heightInvalid = heightIsEmpty || heightZero || isNaN(formObj['height-ft']) || isNaN(formObj['height-in'])
			const weightIsInvalid = weightIsEmpty || weightZero || isNaN(formObj['weight-st']) || isNaN(formObj['weight-lbs'])

			const invalidMsg =
				'Fields can not be empty. Example: Your weight is 143 pounds -> type : 0 stones 143 pounds or 10 stones 3.3 pounds '

			this.errMsg = this.form.querySelector(`#${input[0]}`).parentElement.parentElement.nextElementSibling

			if (heightInvalid || weightIsInvalid) {
				this.formStateHandler(false, invalidMsg)
				return
			}

			this.formStateHandler(true)
		})
	}


	errorsHandler() {
		this.formIsValid = false
		this.state === 'metric' ? this.metricIsValid() : this.imperialIsValid()
	}

	renderBmiScoreInfo() {
		const resultBox = document.querySelector('.results__result-box')

		const html = `
            <h2>What your BMI means</h2>
            <p>
                A BMI range of <span class="bmi-range">${this.bmiRange}</span> is considered a <span class="bmi-range-result"
                >'${this.bmiStatus}'</span>
                . Maintaining a healthy weight may lower your chances of experiencing health issues later on,
                such as obesity and type 2 diabetes. Aim for a noutritious diet with reduced fat and sugar content,
                incorporating ample fruits and vegetables. Additionally, strive for regular physical activity, idally
                about 30 minutes daily for five days a week.
            </p>
        `
		resultBox.innerHTML = ''

		resultBox.insertAdjacentHTML('beforeend', html)
	}

	renderScore() {
		this.calcBMI()
		this.checkBMIStatus(this.bmi)
		this.renderBmiScoreInfo()

		const resultEl = this.form.parentElement.querySelector('.hero__result')

		const welcomeText = resultEl.querySelector('.welcome-text')



		if (welcomeText) {
			resultEl.removeChild(welcomeText)
		}

		resultEl.innerHTML = ''

		const html = `
            
                <div class="bmi-score">
                    <p>Your BMI is...</p>
                    <h4>${this.bmi}</h4>
                </div>

                <div class="bmi-info">
                    <p>
                        Your BMI suggests you're a <span class="bmi-level">${this.bmiStatus}</span>. Your ideal weight is
                        <span class="bmi-ratio">${this.idealWeight}</span>
                    </p>
                </div>
        `

    
		resultEl.insertAdjacentHTML('beforeend', html)
	}

	inputsListener() {
		const inputs = document.querySelectorAll('input')
		console.log(this.state)

		inputs.forEach(input =>
			input.addEventListener('input', () => {
				this.errorsHandler()
				console.log(this.formIsValid)
				if (this.formIsValid) this.renderScore()
			})
		)
	}

	handlingForm(e) {
		e.preventDefault()
		this.errorsHandler()
		console.log(this.formIsValid)

		if (this.formIsValid) this.renderScore()
	}
}

const form = new Form()
