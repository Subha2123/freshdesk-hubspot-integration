const FormLayout = ({ children }) => {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="p-6 space-y-2 md:space-y-6 sm:p-8 min-w-md shadow rounded-lg">
                {children}
            </div>
        </div>

    )
}

export default FormLayout