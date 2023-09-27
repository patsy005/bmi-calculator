export default class MetricForm {
	constructor(form) {
		this.form = form
	}

	createMetricForm() {
		const html = `
        <div class="form__box form__box--metric">
            <div class="form__box-group">
                <label for="height">Height</label>
                <div class="form__box-input">
                    <input type="text" name="height" id="height" inputmode="numeric" placeholder="0" />
                    <span>cm</span>
                </div>
                <p class="error-msg display-none"></p>
            </div>

            <div class="form__box-group">
                <label for="weight">Weight</label>
                <div class="form__box-input">
                    <input type="text" name="weight" id="weight" inputmode="numeric" placeholder="0" />
                    <span>kg</span>
                </div>
                <p class="error-msg display-none"></p>
            </div>
        </div>
        <button type="submit" class="display-none"></button>
        `

		this.form.insertAdjacentHTML('beforeend', html)
	}
}

