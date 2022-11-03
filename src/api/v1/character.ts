import express from 'express'
import dbCharacterService from '../../services/dbCharacterService'
import authorizedMiddleWare, { RequestWithUser } from '../../middlware/authenticatedMiddleware'
import Character, { getNewCharacter } from '../../types/character_type'

const router = express.Router()
router.use(authorizedMiddleWare)

router.get('/', (req: RequestWithUser, res) => {
  dbCharacterService.findCharacterById(req.user.id).then((character: Character) => {
    res.json(character)
  }).catch(err => console.error(err))
})

router.post('/', (req: RequestWithUser, res) => {
  const sanitizedCharacter: Character = sanitizeCharacter(req.body, req.user.id)
  dbCharacterService.updateCharacter(sanitizedCharacter).then(() => {
    res.sendStatus(200)
  }).catch(err => console.error(err))
})

function sanitizeCharacter (requestBody: any, userId: string) {
  const sanitizedCharacter: Character = getNewCharacter()

  sanitizedCharacter.id = userId
  sanitizedCharacter.characterName = requestBody.characterName ?? ''
  sanitizedCharacter.primaryWeapon1 = requestBody.primaryWeapon1 ?? ''
  sanitizedCharacter.primaryWeapon2 = requestBody.primaryWeapon2 ?? ''
  sanitizedCharacter.primaryRole = requestBody.primaryRole ?? ''
  sanitizedCharacter.primaryArmor = requestBody.primaryArmor ?? ''
  sanitizedCharacter.primaryGS = requestBody.PrimaryGS ?? 0
  sanitizedCharacter.secondaryWeapon1 = requestBody.secondaryWeapon1 ?? ''
  sanitizedCharacter.secondaryWeapon2 = requestBody.secondaryWeapon2 ?? ''
  sanitizedCharacter.secondaryRole = requestBody.secondaryRole ?? ''
  sanitizedCharacter.secondaryArmor = requestBody.secondaryArmor ?? ''
  sanitizedCharacter.secondaryGS = requestBody.secondaryGS ?? 0
  sanitizedCharacter.discordUserName = requestBody.discordUserName ?? ''
  sanitizedCharacter.inactive = requestBody.inactive ?? false
  sanitizedCharacter.crafting.weaponSmithing = requestBody.weaponSmithing ?? false
  sanitizedCharacter.crafting.armoring = requestBody.armoring ?? false
  sanitizedCharacter.crafting.engineering = requestBody.engineering ?? false
  sanitizedCharacter.crafting.jewelCrafting = requestBody.jewelCrafting ?? false
  sanitizedCharacter.crafting.arcana = requestBody.arcana ?? false
  sanitizedCharacter.crafting.cooking = requestBody.cooking ?? false
  sanitizedCharacter.crafting.furnishing = requestBody.furnishing ?? false
  return sanitizedCharacter
}

export default router
