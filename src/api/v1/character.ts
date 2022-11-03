import express from 'express'
import dbCharacterService from '../../services/dbCharacterService'
import authorizedMiddleWare, { RequestWithUser } from '../../middlware/authenticatedMiddleware'
import Character, { getNewCharacter } from '../../types/character_type'
import User from '../../types/user_type'

const router = express.Router()
router.use(authorizedMiddleWare)

router.get('/', (req: RequestWithUser, res) => {
  dbCharacterService.findCharacterById(req.user.id).then((character: Character) => {
    res.json(character)
  }).catch(err => console.warn(err))
})

router.post('/', (req: RequestWithUser, res) => {
  const sanitizedCharacter: Character = sanitizeCharacter(req.body, req.user)
  dbCharacterService.updateCharacter(sanitizedCharacter).then(() => {
    res.sendStatus(200)
  }).catch(err => console.warn(err))
})

function sanitizeCharacter (requestBody: any, user: User) {
  console.info(user)
  const sanitizedCharacter: Character = getNewCharacter()

  sanitizedCharacter.id = user.id
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
  sanitizedCharacter.discordUserName = user.user_name
  sanitizedCharacter.inactive = requestBody.inactive ?? false
  sanitizedCharacter.crafting.weaponSmithing = requestBody.crafting.weaponSmithing ?? false
  sanitizedCharacter.crafting.armoring = requestBody.crafting.armoring ?? false
  sanitizedCharacter.crafting.engineering = requestBody.crafting.engineering ?? false
  sanitizedCharacter.crafting.jewelCrafting = requestBody.crafting.jewelCrafting ?? false
  sanitizedCharacter.crafting.arcana = requestBody.crafting.arcana ?? false
  sanitizedCharacter.crafting.cooking = requestBody.crafting.cooking ?? false
  sanitizedCharacter.crafting.furnishing = requestBody.crafting.furnishing ?? false
  return sanitizedCharacter
}

export default router
