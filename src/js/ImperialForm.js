export default class ImperialForm {
	constructor(form) {
		this.form = form
	}

	createImperialForm() {
		const html = `
        <div class="form__box form__box--imperial">
            <div class="form__box-group">
                <label for="height-ft">Height</label>
                <div class="form__box-inputs-imperial form__box-inputs-imperial--height">
                    <div class="form__box-input">
                        <input type="text" name="height-ft" id="height-ft" inputmode="numeric" pattern="[0-9]*" placeholder="0" />
                        <span>ft</span>
                    </div>
                    <label for="height-in"></label>
                    <div class="form__box-input">
                        <input type="text" name="height-in" id="height-in" inputmode="numeric" pattern="[0-9]*" placeholder="0" />
                        <span>in</span>
                    </div>
                </div>
                <p class="error-msg display-none"></p>
            </div>

            <div class="form__box-group">
                <label for="weight-st">Weight</label>
                <div class="form__box-inputs-imperial form__box-inputs-imperial--weight">
                    <div class="form__box-input">
                        <input type="text" name="weight-st" id="weight-st" inputmode="numeric" placeholder="0" />
                        <span>st</span>
                    </div>
                    <label for="weight-lbs"></label>
                    <div class="form__box-input">
                        <input type="text" name="weight-lbs" id="weight-lbs" inputmode="numeric" placeholder="0" />
                        <span>lbs</span>
                    </div>
                </div>
                <p class="error-msg display-none"></p>
            </div>
        </div>
        <button type="submit" class="display-none"></button>
        `

		this.form.insertAdjacentHTML('beforeend', html)
	}
}