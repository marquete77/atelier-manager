import React, { useState } from 'react'
import { supabase } from '../../config/supabase'
import { Link, useNavigate } from 'react-router-dom'
import styles from './LoginView.module.css'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export const LoginView = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            })

            if (error) throw error
            navigate('/')
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión')
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
                    <p className={styles.subtitle}>Bienvenido de nuevo, artesano.</p>
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
                        {loading ? <Loader2 className={styles.spinner} size={20} /> : 'Iniciar Sesión'}
                    </button>
                </form>

                {/* Footer */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className={styles.link}>
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
