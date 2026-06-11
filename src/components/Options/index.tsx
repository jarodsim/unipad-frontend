'use client'

import { useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button, Label, ListBox, Select } from '@heroui/react'
import type { Key } from '@heroui/react'

import HeaderMenu from '@/components/HeaderMenu'
import MyButton from '@/components/Button'
import { menuPanelStyles } from '@/components/menuPanelStyles'

import { languages } from '@/constants/languages'

import { PadContext } from '@/context/padContext'
import { MenuContext } from '@/context/menuContext'
import { SnackbarContext } from '@/context/snackbarContext'

import api from '@/service/api'
import useHandleLocalToken from '@/components/hooks/useHandleLocalToken'

export default function Options({ handleCloseMenu }: { handleCloseMenu: () => void }) {
  const [format, setFormat] = useState('javascript')

  const url = usePathname()
  const token = useHandleLocalToken()

  const { format: formatContext, setFormat: setFormatContext } =
    useContext(PadContext)
  const { setShowMenu } = useContext(MenuContext)
  const { setSnackObject } = useContext(SnackbarContext)

  useEffect(() => {
    setFormat(formatContext)
  }, [formatContext])

  async function updateFormat() {
    const { data } = await api.put(
      '',
      {
        url,
        pad: '',
        format,
        onlyformat: true,
      },
      {
        headers: {
          authorization: String(token),
        },
      }
    )

    if (data.success) {
      setSnackObject({
        open: true,
        message: 'Formato atualizado com sucesso!',
        type: 'success',
      })
    }
  }

  return (
    <div className="min-h-full w-full px-5 pb-8 text-white">
      <HeaderMenu
        title="CONFIGURAÇÕES DA URL"
        actionButton={
          <Button
            isIconOnly
            variant="ghost"
            className="text-white hover:bg-white/10"
            aria-label="Voltar"
            onPress={handleCloseMenu}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Button>
        }
      />
      <div className="mx-auto flex w-full max-w-[360px] flex-col items-center pt-3">
        <h5 className="mb-6 max-w-full truncate text-center text-xl font-extrabold text-white drop-shadow-sm">
          {url}
        </h5>
        
        <div className="flex w-full flex-col gap-4">
          <div className="w-full">
            <Select
              className={menuPanelStyles.field}
              placeholder="Selecione o formato"
              selectedKey={format}
              onSelectionChange={(key: Key | null) => {
                if (key) {
                  setFormat(String(key))
                  setFormatContext(String(key))
                }
              }}
            >
              <Label className={menuPanelStyles.label}>Formato</Label>
              <Select.Trigger className={menuPanelStyles.selectTrigger}>
                <Select.Value className={menuPanelStyles.selectValue} />
                <Select.Indicator className="text-white/70" />
              </Select.Trigger>
              <Select.Popover className="border border-red-100/80 bg-white shadow-xl">
                <ListBox>
                  {languages.map((language) => {
                    const val = language === 'GO' ? language.toLowerCase() : language;
                    return (
                      <ListBox.Item key={val} id={val} textValue={language}>
                        {language}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    )
                  })}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          <MyButton
            label="SALVAR"
            variant="primary"
            callback={() => updateFormat()}
            fullWidth
            className={menuPanelStyles.primaryAction}
          />
          <MyButton
            label="NOVA URL"
            variant="secondary"
            callback={() => setShowMenu('NEWURL')}
            fullWidth
            className={menuPanelStyles.secondaryAction}
          />
        </div>

        <p className="mt-12 text-center text-sm text-white/90">
          Desenvolvido por{' '}
          <a
            href="https://jarod.dev"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-white no-underline hover:underline"
          >
            Jarod Mateus
          </a>
        </p>
      </div>
    </div>
  )
}
