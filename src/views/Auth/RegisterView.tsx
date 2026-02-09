import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../config/supabase'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import styles from './RegisterView.module.css'

export const RegisterView = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // 1. Sign up user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                    },
                },
            })

            if (authError) throw authError

            // Note: We're relying on a Supabase Trigger (or Manual Insert later) to create the public.clients record.
            // For now, simple auth is enough to get them in.

            navigate('/')
        } catch (err: any) {
            setError(err.message || 'Error al registrar usuario')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.logoText}>Atelier<span className={styles.logoSuffix}>Manager</span></h1>
                    <p className={styles.subtitle}>Únete a Atelier Manager.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Nombre Completo
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                required
                                className={styles.input}
                                placeholder="Tu nombre y apellido"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Email
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                required
                                className={styles.input}
                                placeholder="nombre@atelier.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Contraseña
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                className={`${styles.input} ${styles.passwordInput}`}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.eyeButton}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? <Loader2 className={styles.spinner} size={20} /> : 'Crear Cuenta'}
                    </button>
                </form>

                {/* Footer */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className={styles.link}>
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
