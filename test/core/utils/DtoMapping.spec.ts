/*
 * Copyright 2020 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { expect } from 'chai';
import { MosaicId } from '../../../src/model/mosaic/MosaicId';
import { NetworkType } from '../../../src/model/network/NetworkType';
import { PublicAccount } from '../../../src/model/account/PublicAccount';
import {
    AccountRestrictionsInfoDTO,
    AccountRestrictionsDTO,
    AccountRestrictionDTO,
    AccountRestrictionFlagsEnum,
} from 'symbol-openapi-typescript-fetch-client';
import { DtoMapping } from '../../../src/core/utils/DtoMapping';

describe('DtoMapping', () => {
    const publicAccount = PublicAccount.createFromPublicKey(
        '9801508C58666C746F471538E43002B85B1CD542F9874B2861183919BA8787B6',
        NetworkType.PRIVATE_TEST,
    );
    const address = publicAccount.address;
    const mosaicId = new MosaicId('11F4B1B3AC033DB5');

    it('extractRestrictionInfo - Operation', () => {
        const restrictionInfo = {} as AccountRestrictionsInfoDTO;
        const restrictionsDto = {} as AccountRestrictionsDTO;
        const restriction = {} as AccountRestrictionDTO;
        restriction.restrictionFlags = AccountRestrictionFlagsEnum.NUMBER_16388;
        restriction.values = [16724];
        restrictionsDto.restrictions = [restriction];
        restrictionsDto.address = address.encoded();

        restrictionInfo.accountRestrictions = restrictionsDto;
        const result = DtoMapping.extractAccountRestrictionFromDto(restrictionInfo);
        expect(result).not.to.be.undefined;
        expect(result.accountRestrictions.restrictions[0].values[0]).to.be.equal(16724);
    });

    it('extractRestrictionInfo - Mosaic', () => {
        const address = publicAccount.address;
        const restrictionInfo = {} as AccountRestrictionsInfoDTO;
        const restrictionsDto = {} as AccountRestrictionsDTO;
        const restriction = {} as AccountRestrictionDTO;
        restriction.restrictionFlags = AccountRestrictionFlagsEnum.NUMBER_2;
        restriction.values = [mosaicId.toHex()];
        restrictionsDto.restrictions = [restriction];
        restrictionsDto.address = address.encoded();

        restrictionInfo.accountRestrictions = restrictionsDto;
        const result = DtoMapping.extractAccountRestrictionFromDto(restrictionInfo);
        expect(result).not.to.be.undefined;
        expect((result.accountRestrictions.restrictions[0].values[0] as MosaicId).toHex()).to.be.equal(mosaicId.toHex());
    });

    it('parseServerDuration', () => {
        const epochS = '12345s';
        expect(DtoMapping.parseServerDuration(epochS).seconds()).to.be.equal(12345);
        const epochM = '12345m';
        expect(DtoMapping.parseServerDuration(epochM).toMinutes()).to.be.equal(12345);
        const epochH = '12345h';
        expect(DtoMapping.parseServerDuration(epochH).toHours()).to.be.equal(12345);
        const epochMS = '12345ms';
        expect(DtoMapping.parseServerDuration(epochMS).toMillis()).to.be.equal(12345);
        const epochD = '12345d';
        expect(DtoMapping.parseServerDuration(epochD).toDays()).to.be.equal(12345);
    });

    it('parseServerDuration - exception', () => {
        expect(() => {
            const epochS = '12345g';
            DtoMapping.parseServerDuration(epochS).seconds();
        }).to.throw();
        expect(() => {
            const epochS = 'adfs';
            DtoMapping.parseServerDuration(epochS).seconds();
        }).to.throw();
        expect(() => {
            const epochS = '123s45';
            DtoMapping.parseServerDuration(epochS).seconds();
        }).to.throw();
    });
});
