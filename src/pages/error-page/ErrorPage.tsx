import { useNavigate } from 'react-router-dom'
import { CustomButton } from '../../components/custom-button/CustomButton'

export default function ErrorPage() {
    const navigate = useNavigate()

    return (
        <div className="container text-center mt-5">
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <p className="lead">Ops! A página que você procura não existe.</p>
            <CustomButton onClick={() => navigate('/')}>
                Voltar para o Início
            </CustomButton>
        </div>
    )
}