import styles from "./LabeledInput.module.css";

/**
 * LabeledInput component for forms, consisting of a label and a specified input
 * @param {string props.id} ID - The ID of the input, used to identify it
 * -- Currently, the ID is also used as the name of the input
 * @param {string props.label} Label - The label to display before the input
 * @param {string props.type} Type - The type of input to display (text(area), email, password, etc.)
 * @param {string props.value} [DefaultValue] - The defaultValue of the input
 * @param {bool props.disabled} [Disabled] - Whether or not the input is disabled
 * @param {bool props.required} [Required] - Whether or not the input is required
 * @param {string props.orientation} [Orientation] - Horizontal: Display the label and input side by side. Vertical: Display the label above the input
 * @param {string props.placeholder} [Placeholder] - The placeholder text to display in the input
 * @param {Object props.containerStyle} [containerStyle] - The style to apply to the container div
 * @param {Object props.labelStyle} [labelStyle] - The style to apply to the label
 * @param {Object props.inputStyle} [inputStyle] - The style to apply to the input
 * @param {string props.containerClassName} [containerClassName] - The className to apply to the container div
 * @param {string props.labelClassName} [labelClassName] - The className to apply to the label
 * @param {string props.inputClassName} [inputClassName] - The className to apply to the input
 * @param {object props.rest} rest - Any other props to pass to the input
 * -- This could include validation rules and event handlers { maxLength: 8, onClick: () => { console.log("Clicked") }
 * @returns <LabeledInput /> LabeledInput JSX component
 */
export default function LabeledInput(props) {
    const { id, label = "Input", type = "text", defaultValue, disabled = false, required = false, orientation = "vertical", placeholder, containerStyle, labelStyle, inputStyle, containerClassName, labelClassName, inputClassName, ...rest } = props;
    
    let orientationStyle = orientation === "horizontal" ? { display: "flex", flexDirection: "row", alignItems: "center" } : { display: "flex", flexDirection: "column", alignItems: "flex-start" };

    return (
        <div key={"container" + id} className={styles.LabeledInput + (containerClassName ? ` ${containerClassName}` : "")} style={{ ...containerStyle, ...orientationStyle }}>
            <label htmlFor={id} className={labelClassName} style={labelStyle}>{label}</label>
            {(type === "textarea") ?
                <textarea disabled={!!disabled} key={id} id={id} name={id} defaultValue={defaultValue} placeholder={placeholder} className={inputClassName} style={inputStyle} required={!!required} {...rest} />
                :
                <input disabled={!!disabled} key={"input"+id} id={id} name={id} type={type} defaultValue={defaultValue} placeholder={placeholder} className={inputClassName} style={inputStyle} required={!!required} {...rest} />
            }
        </div>
    );
};
